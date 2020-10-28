# react-native-standalone-video-player

React Native video player which can be re-used across views 

In 90% of cases [react-native-video](https://github.com/react-native-video/react-native-video) will be enough. However there may be some cases when you need the Player to be separated from the View:
  - Loading video before presenting it
  - Showing the same video in different parts of the app (like preview and then fullview)
  - As list element

![video](https://github.com/SparingSoftware/react-native-standalone-video-player/blob/main/assets/ios_2views.gif)
![video](https://github.com/SparingSoftware/react-native-standalone-video-player/blob/main/assets/android_2views.gif)


> On iOS it is possible to stream at multiple views simultaneusly.
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

const { load, play, pause } = useVideoPlayer();

useEffect(() => {
  load('VIDEO_URL');
}, []);

// First player ...
<PlayerVideoView
  style={styles.player}
/>

//...

```

## TODO
1) Docs
2) isBoundToPlayer vs rerender
3) tag version


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
