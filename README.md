# react-native-standalone-video-player

React Native video player which can be re-used across views 
> **Still under development** (no official release yet).

---

In 90% of cases [react-native-video](https://github.com/react-native-video/react-native-video) will be enough. However there may be some cases when you need the Player to be separated from the View:
  - Loading video before presenting it
  - Showing the same video in different parts of the app (like preview and then fullview)
  - As list element

---

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

// ...

<PlayerVideoView
  style={styles.player}
/>


```

## Docs

View
* [PlayerVideoView](#PlayerVideoView)

Hooks
* [useVideoPlayer](#useVideoPlayer)
* [usePlayerVideoStatus](#usePlayerVideoStatus)
* [usePlayerVideoProgress](#usePlayerVideoProgress)

Imperative
* PlayerVideoManager
* getVideoDuration
* clearPlayerVideo



### useVideoPlayer
| returns | params |
| ------ | ------ |
| play | |
| pause |  |
| stop |  |
| load | `url: string, autoplay: boolean = true, isHls = true` |
| seek | `time: number` |
| seekForward | `time: number` |
| seekRewind | `time: number` |

### usePlayerVideoStatus
PlayerStatus
| status |
| ------ |
| new |
| loading |
| playing | 
| paused |
| error  |
| stopped |
| none  |

### usePlayerVideoProgress
| returns | params |
| ------ | ------ |
| progress | number 0...1|
| duration | number |

### PlayerVideoView
| prop |  |
| ------ | ------ |
| isBoundToPlayer | `boolean` - if `true` player will stream into this view |


## Other

### Multiple instances
You can have multiple simultaneus players with different URIs. Each function/hook and PlayerVideoView have `playerInstance` prop or param.

```jsx
const { load } = useVideoPlayer(0);
const { load: loadOther } = useVideoPlayer(1);

// ...

<PlayerVideoView
  playerInstance={0}
/>

// ...

<PlayerVideoView
  playerInstance={1}
/>
```

### ExoPlayer / AVPlayer
On the native side on iOS it uses AVPlayer and on Android - ExoPlayer.

### isBoundToPlayer vs optional rendering
You can use `isBoundToPlayer` as option to enable/disable streaming to this view. You can also use traditional optional rendering instead:
```
{ isActive && <PlayerVideoView ... }
```
Using `isBoundToPlayer` is better because it does not require rerenders however it may lead to strange behaviour especially on Android. I am still not sure which option to use...

---

Template Generated with https://github.com/callstack/react-native-builder-bob

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
