import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  useVideoPlayer,
  usePlayerVideoStatus,
  createStandalonePlayerVideoInstance,
  PlayerVideoView,
  PlayerStatus,
} from 'react-native-standalone-video-player';

console.disableYellowBox = true;

//

type ItemProps = {
  index: number;

  isActive: boolean;

  onPress?: (index: number) => void;
};

//
const CoverUrl = 'https://www.voicesummit.ai/hubfs/video-placeholder.jpg';
const VideoUrl =
  'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

const isIOS = Platform.OS === 'ios';

//

const Item = (props: ItemProps) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.8}
      onPress={() => props.onPress?.(props.index)}
    >
      <View style={styles.player} pointerEvents={'none'}>
        <PlayerVideoView
          style={styles.player}
          isBoundToPlayer={props.isActive}
        />
        {!props.isActive && (
          <Image style={styles.playerCover} source={{ uri: CoverUrl }} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const ItemMemo = React.memo(Item);

//

const items = Array.from(Array(10).keys());

//

export default function App() {
  const { load } = useVideoPlayer();

  const [activeIndex, setActiveItem] = useState(0);

  React.useEffect(() => {
    load(VideoUrl, false);
  }, []);

  //

  const onItemPress = useCallback((index: number) => {
    setActiveItem(index);

    console.log('onItemPress: ', index);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={items}
        extraData={activeIndex}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ index }) => (
          <ItemMemo
            index={index}
            isActive={isIOS ? true : index === activeIndex}
            onPress={onItemPress}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  list: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  player: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  itemContainer: {
    width: '100%',
    height: 250,
  },
  playerCover: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
