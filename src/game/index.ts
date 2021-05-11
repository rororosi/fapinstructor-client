/**
 * The entry point to kick start and configure the game
 */
import { gameLoopObservable } from "engine/loop";
import interrupt from "engine/interrupt";
import { createAudioContext } from "engine/audio";
import configureStore from "./configureStore";
import actionLoop from "./loops/actionLoop";
import strokerLoop from "./loops/strokeEmitter";
import moanLoop from "./loops/moanLoop";
import ticker from "./loops/ticker";
import {
  strokeSpeedBaseLineAdjustmentLoop,
  strokeSpeedAdjustmentLoop,
  gripAdjustmentLoop,
} from "./loops/strokeSpeedLoop";
import store from "store";

import { MediaService, StrokeService } from "game/xstate/services";

const loops = [
  actionLoop,
  strokerLoop,
  moanLoop,
  ticker,
  strokeSpeedAdjustmentLoop,
  strokeSpeedBaseLineAdjustmentLoop,
  gripAdjustmentLoop,
];

const observers: number[] = [];

const startGame = async () => {
  await createAudioContext();
  configureStore();

  // Start services
  MediaService.initialize(store.config);
  StrokeService.initialize(store.config);

  loops.forEach((loop) => {
    loop.reset();

    const id = gameLoopObservable.subscribe(loop);
    observers.push(id);
  });

  return true;
};

const stopGame = () => {
  interrupt();

  observers.forEach((id) => {
    gameLoopObservable.unsubscribe(id);
  });
};

export { startGame, stopGame };
