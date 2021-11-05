import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";

import { PUBLIC_URL } from "@/config";
import Page from "@/components/atoms/Page";
import { Head } from "@/components/Head";

const ChangeLogMDUrl = `${PUBLIC_URL}/CHANGELOG.md`;

export default function ChangeLog() {
  const [changeLogMD, setChangeLogMD] = useState("");

  useEffect(() => {
    fetch(ChangeLogMDUrl)
      .then((res) => res.text())
      .then(setChangeLogMD);
  }, []);

  return (
    <Page className="markdown-body">
      <Head title="Change Log" />
      <ReactMarkdown>{changeLogMD}</ReactMarkdown>
    </Page>
  );
}
