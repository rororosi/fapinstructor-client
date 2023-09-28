import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";

import { MediaLink, MediaType } from "@/types/Media";

const SESSION_STORAGE_REDGIF_TOKEN = "redgif_token";

async function fetchAuthToken() {
  const response = await axios<{ token: string }>(
    "https://api.redgifs.com/v2/auth/temporary"
  );
  return response.data.token;
}

function isTokenExpired(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);
  if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
    return true;
  }
  return false;
}

function getAuthToken() {
  return sessionStorage.getItem(SESSION_STORAGE_REDGIF_TOKEN);
}

function setAuthToken(token: string) {
  return sessionStorage.setItem(SESSION_STORAGE_REDGIF_TOKEN, token);
}

async function instance<T>(url: string): Promise<T> {
  let token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    token = await fetchAuthToken();
    setAuthToken(token);
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, { headers });
  return res.json();
}

type RedGif = {
  id: string;
  duration: number;
  urls: {
    hd: string;
  };
};


type SearchResponse = {
  gif: RedGif;
};

export async function searchRedGifs(id: string): Promise<MediaLink> {
  const response = await instance<SearchResponse>(
    `https://api.redgifs.com/v2/gifs/${id}`
  );

  return {
    mediaType: MediaType.Video,
    sourceLink: `https://www.redgifs.com/watch/${response.gif.id}`,
    directLink: response.gif.urls.hd,
  };
}
