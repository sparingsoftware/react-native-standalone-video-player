import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  load(instance: number, url: string, hls: boolean, loop: boolean): void;

  seek(instance: number, position: number): void;

  seekForward(instance: number, time: number): void;

  seekRewind(instance: number, time: number): void;

  play(instance: number): void;

  pause(instance: number): void;

  stop(instance: number): void;

  getDuration(instance: number): Promise<number>;
  getProgress(instance: number): Promise<number>;

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
  finished = 'finished', // 6
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

function getVideoProgress(playerInstance = 0): Promise<number> {
  return new Promise((resolve) => {
    PlayerVideoManager.getProgress(playerInstance)
      .then((val) => resolve(val || 0))
      .catch(() => resolve(0));
  });
}

//

function useVideoPlayer(playerInstance = 0) {
  const play = useCallback(() => {
    PlayerVideoManager.play(playerInstance);
  }, [playerInstance]);

  const pause = useCallback(() => {
    PlayerVideoManager.pause(playerInstance);
  }, [playerInstance]);

  const stop = useCallback(() => {
    // emit here for faster loop (dont wait from native)
    eventEmitter.emit('PlayerStatusChanged', {
      instance: playerInstance,
      status: 5,
    });

    CurrentVideoId[playerInstance] = null;

    PlayerVideoManager.stop(playerInstance);
  }, [playerInstance]);

  const load = useCallback(
    (
      url: string,
      autoplay: boolean = true,
      id: string | null = null,
      isHls = true,
      loop = false
    ) => {
      if (playerInstance >= PlayerInstances) {
        createStandalonePlayerVideoInstance();
      }

      // notify current video
      if (CurrentVideoId[playerInstance]) {
        eventEmitter.emit('PlayerStatusChanged', {
          instance: playerInstance,
          status: 5, // stopped
        });
      }

      CurrentVideoId[playerInstance] = id;

      // emit here for faster loop (dont wait from native)
      eventEmitter.emit('PlayerStatusChanged', {
        instance: playerInstance,
        status: 1, // loading
      });

      if (autoplay) {
        // TODO: handle autoplay
      }

      PlayerVideoManager.load(playerInstance, url, isHls, loop);
    },
    [playerInstance]
  );

  const seek = useCallback(
    (pos: number) => {
      PlayerVideoManager.seek(playerInstance, pos);
    },
    [playerInstance]
  );

  const seekForward = useCallback(
    (time: number) => {
      PlayerVideoManager.seekForward(playerInstance, time);
    },
    [playerInstance]
  );

  const seekRewind = useCallback(
    (time: number) => {
      PlayerVideoManager.seekRewind(playerInstance, time);
    },
    [playerInstance]
  );

  const getCurrentVideoId = useCallback(() => {
    // not the best way to return global var here...
    return CurrentVideoId[playerInstance];
  }, [playerInstance]);

  return useMemo(
    () => ({
      play,
      pause,
      stop,
      load,
      seek,
      seekForward,
      seekRewind,
      getCurrentVideoId,
    }),
    [getCurrentVideoId, load, pause, play, seek, seekForward, seekRewind, stop]
  );
}

//
// Event Hooks
//

const eventEmitter = new NativeEventEmitter(StandaloneVideoPlayer);

const PlayerInfo = {
  // for each player instance
  // TODO: make it dynamic for more players...
  lastStatus: [
    PlayerStatus.none,
    PlayerStatus.none,
    PlayerStatus.none,
    PlayerStatus.none,
    PlayerStatus.none,
  ],
};

function usePlayerVideoStatus(playerInstance = 0, recordingId?: string) {
  // get current status
  const [status, setStatus] = useState(PlayerInfo.lastStatus[playerInstance]);

  useEffect(() => {
    const subscription = eventEmitter.addListener(
      'PlayerStatusChanged',
      (data) => {
        if (data.instance === playerInstance) {
          if (!recordingId || recordingId === CurrentVideoId[playerInstance]) {
            PlayerInfo.lastStatus[playerInstance] = createStatus(data.status);

            setStatus(createStatus(data.status));
          }
        }
      }
    );

    return () => subscription.remove();
  }, [playerInstance, recordingId]);

  const forceLoadingStatus = () => {
    setStatus(PlayerStatus.loading);
  };

  return {
    status,
    forceLoadingStatus,
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
    getVideoProgress(playerInstance).then(setProgress);
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
    case 7:
      return PlayerStatus.finished;
  }

  return PlayerStatus.none;
}

// - - - - - -
// Video View
// - - - - - -

// requireNativeComponent automatically resolves '(RNTPlayerVideoView)' to 'RNTPlayerVideoViewManager'
const RNTPlayerVideoView = requireNativeComponent('RNTPlayerVideoView');

//

interface PlayerViewProps {
  // if true this view will be presenting video from Player
  isBoundToPlayer?: boolean;

  // you can use multiple instances of player (now supported only on ioS)
  playerInstance?: number;

  // any other prop
  // TODO: use React's view's props...
  [key: string]: any;
}

//

const PlayerVideoView: React.FunctionComponent<PlayerViewProps> = (
  props: PlayerViewProps
) => {
  return <RNTPlayerVideoView {...props} />;
};

PlayerVideoView.defaultProps = {
  isBoundToPlayer: false,
  playerInstance: -1,
};

//
//
//

export {
  PlayerVideoView,
  PlayerStatus,
  PlayerVideoManager,
  clearPlayerVideo,
  getVideoDuration,
  useVideoPlayer,
  usePlayerVideoStatus,
  usePlayerVideoProgress,
};
