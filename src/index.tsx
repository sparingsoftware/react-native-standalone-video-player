import React, { useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  requireNativeComponent,
} from 'react-native';
import {} from 'react-native';

// - - - - - -

const { StandaloneVideoPlayer } = NativeModules;

type StandaloneVideoPlayerType = {
  newInstance(): void;

  load(instance: number, url: string, hls: boolean): void;

  seek(instance: number, position: number): void;

  seekForward(instance: number, time: number): void;

  seekRewind(instance: number, time: number): void;

  play(instance: number): void;

  pause(instance: number): void;

  stop(instance: number): void;

  getDuration(instance: number): Promise<number>;

  clear(): void;
};

const PlayerVideoManager = StandaloneVideoPlayer as StandaloneVideoPlayerType;

//

enum PlayerStatus {
  new = 'new', //0,
  loading = 'loading', // 1,
  playing = 'playing', // 2,
  paused = 'paused', // 3,
  error = 'error', // 4,
  stopped = 'stopped', // 5,
  none = 'none', // 6
}

//

var PlayerInstances = 0;

// used to distinguish which video is playing
var CurrentVideoId: (string | null)[] = [null, null, null];

//

// you have to call at least once before using any player!
function createStandalonePlayerVideoInstance() {
  PlayerInstances += 1;

  PlayerVideoManager.newInstance();

  return PlayerInstances - 1;
}

//

function clearPlayerVideo() {
  if (PlayerVideoManager && PlayerVideoManager.clear) {
    PlayerVideoManager.clear();
  }
}

//

function getVideoDuration(playerInstance = 0): Promise<number> {
  return new Promise((resolve) => {
    PlayerVideoManager.getDuration(playerInstance)
      .then((val) => resolve(val || 0))
      .catch(() => resolve(0));
  });
}

//

function useVideoPlayer(playerInstance = 0) {
  function play() {
    PlayerVideoManager.play(playerInstance);

    console.log(`PlayerVideo [${playerInstance}] play`);
  }

  function pause() {
    PlayerVideoManager.pause(playerInstance);

    console.log(`PlayerVideo [${playerInstance}] pause`);
  }

  function stop() {
    // emit here for faster loop (dont wait from native)
    eventEmitter.emit('PlayerStatusChanged', {
      instance: playerInstance,
      status: 5,
    });

    CurrentVideoId[playerInstance] = null;

    PlayerVideoManager.stop(playerInstance);

    console.log(`PlayerVideo [${playerInstance}] stop`);
  }

  function load(url: string, id: string | null = null, isHls = true) {
    CurrentVideoId[playerInstance] = id;

    // emit here for faster loop (dont wait from native)
    eventEmitter.emit('PlayerStatusChanged', {
      instance: playerInstance,
      status: 1,
    });

    PlayerVideoManager.load(playerInstance, url, isHls);

    console.log(`PlayerVideo [${playerInstance}] load: ${id}`);
  }

  function seek(pos: number) {
    PlayerVideoManager.seek(playerInstance, pos);

    console.log(`PlayerVideo [${playerInstance}] seek: ${pos}`);
  }

  function seekForward(time: number) {
    PlayerVideoManager.seekForward(playerInstance, time);

    console.log(`PlayerVideo [${playerInstance}] seekForward by: ${time}`);
  }

  function seekRewind(time: number) {
    PlayerVideoManager.seekRewind(playerInstance, time);

    console.log(`PlayerVideo [${playerInstance}] seekRewind by: ${time}`);
  }

  return {
    play,
    pause,
    stop,
    load,
    seek,
    seekForward,
    seekRewind,
    videoId: CurrentVideoId[playerInstance],
  };
}

//
// Event Hooks
//

const eventEmitter = new NativeEventEmitter(StandaloneVideoPlayer);

const PlayerInfo = {
  lastStatus: PlayerStatus.none,
};

function usePlayerVideoStatus(playerInstance = 0) {
  // get current status
  const [status, setStatus] = useState(PlayerInfo.lastStatus);

  useEffect(() => {
    const subscription = eventEmitter.addListener(
      'PlayerStatusChanged',
      (data) => {
        console.log('PlayerStatusChanged: ', data);

        if (data.instance === playerInstance) {
          PlayerInfo.lastStatus = createStatus(data.status);

          setStatus(createStatus(data.status));
        }
      }
    );

    return () => subscription.remove();
  }, [playerInstance]);

  return {
    status,
  };
}

//

function usePlayerVideoProgress(playerInstance = 0) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const subscription = eventEmitter.addListener(
      'PlayerProgressChanged',
      (data) => {
        if (data.instance === playerInstance) {
          setDuration(data.duration);
          setProgress(data.progress);
        }
      }
    );

    return () => subscription.remove();
  }, [playerInstance]);

  useEffect(() => {
    getVideoDuration(playerInstance).then(setDuration);
  }, [playerInstance]);

  return {
    progress,
    duration: duration,
  };
}

//
//
//

function createStatus(status: number): PlayerStatus {
  switch (status) {
    case 0:
      return PlayerStatus.new;
    case 1:
      return PlayerStatus.loading;
    case 2:
      return PlayerStatus.playing;
    case 3:
      return PlayerStatus.paused;
    case 4:
      return PlayerStatus.error;
    case 5:
      return PlayerStatus.stopped;
    case 6:
      return PlayerStatus.none;
  }

  return PlayerStatus.none;
}

// - - - - - -
// Video View
// - - - - - -

// requireNativeComponent automatically resolves '(RNTPlayerVideoView)' to 'RNTPlayerVideoViewManager'
const RNTPlayerVideoView = requireNativeComponent('RNTPlayerVideoView');

//

interface Props {
  // if true this view will be presenting video from Player
  isBoundToPlayer: boolean;

  // you can use multiple instances of player (now supported only on ioS)
  playerInstance: number;

  // any other prop
  // TODO: use React's view's props...
  [key: string]: any;
}

//

const PlayerVideoView = (props: Props) => {
  return <RNTPlayerVideoView {...props} />;
};

//
//
//

export {
  PlayerVideoView,
  PlayerStatus,
  PlayerVideoManager,
  createStandalonePlayerVideoInstance,
  clearPlayerVideo,
  getVideoDuration,
  useVideoPlayer,
  usePlayerVideoStatus,
  usePlayerVideoProgress,
};
