import { NativeModules } from 'react-native';

type StandaloneVideoPlayerType = {
  multiply(a: number, b: number): Promise<number>;
};

const { StandaloneVideoPlayer } = NativeModules;

export default StandaloneVideoPlayer as StandaloneVideoPlayerType;
