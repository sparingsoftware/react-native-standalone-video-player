# react-native-standalone-video-player

React Native video player which can be re-used across views 

In 95% of cases https://github.com/react-native-video/react-native-video will be enough but if you need player which is separated from view - use this one.

![video](https://github.com/SparingSoftware/react-native-standalone-video-player/blob/main/assets/ios_2views.gif)
![video](https://github.com/SparingSoftware/react-native-standalone-video-player/blob/main/assets/android_2views.gif)


> On iOS it is possible to streatm at multiple views simultaneusly.
> On Android it is not supported yet. (TODO: check SurfaceTexture)


## Installation

```sh
npm install https://github.com/SparingSoftware/react-native-standalone-video-player
```

## Usage

```js
import {
  useVideoPlayer,
  PlayerVideoView,
} from 'react-native-standalone-video-player';
// ...

const { load, play, pause } = useVideoPlayer(0);

useEffect(() => {
  load('VIDEO_URL');
}, []);

//...
<PlayerVideoView
  style={styles.player}
  isBoundToPlayer={true}
  playerInstance={0}
/>
//...


```

## TODO
1) Docs
2) Example (FlatList) with giff
3) Android multiviews (SurfaceView?)
4) isBoundToPlayer vs rerender
5) tag version


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
