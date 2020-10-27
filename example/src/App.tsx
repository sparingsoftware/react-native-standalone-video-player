import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import {
  useVideoPlayer,
  usePlayerVideoStatus,
  createStandalonePlayerVideoInstance,
  PlayerVideoView,
  PlayerStatus,
} from 'react-native-standalone-video-player';

// create instance
createStandalonePlayerVideoInstance();

export default function App() {
  const [isTopViewActive, setTopViewActive] = useState(true);
  const [isBottomViewActive, setBottomViewActive] = useState(true);

  const { load, play, pause } = useVideoPlayer(0);
  const { status } = usePlayerVideoStatus(0);

  React.useEffect(() => {
    load(
      'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
    );
  }, []);

  //

  function onPlayPausePress() {
    if (status == PlayerStatus.playing) {
      pause();
    } else {
      play();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <PlayerVideoView
          style={styles.player}
          isBoundToPlayer={isTopViewActive}
          playerInstance={0}
        />
        <Button
          title={isTopViewActive ? 'HIDE' : 'SHOW'}
          onPress={() => setTopViewActive(!isTopViewActive)}
        />
      </View>
      <View style={styles.playerContainer}>
        <PlayerVideoView
          style={styles.player}
          isBoundToPlayer={isBottomViewActive}
          playerInstance={0}
        />
        <Button
          title={isBottomViewActive ? 'HIDE' : 'SHOW'}
          onPress={() => setBottomViewActive(!isBottomViewActive)}
        />
      </View>
      <View style={styles.controls}>
        <Button
          title={status == PlayerStatus.playing ? 'PAUSE' : 'PLAY'}
          onPress={onPlayPausePress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  player: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
  playerContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  controls: {
    width: '100%',
    marginTop: 50,
    justifyContent: 'flex-start',
  },
});
