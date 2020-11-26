package com.reactnativestandalonevideoplayer


import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class StandaloneVideoPlayer(val context: ReactApplicationContext): ReactContextBaseJavaModule(context), LifecycleEventListener {

  override fun getName(): String {
    return "StandaloneVideoPlayer"
  }

  //
  // Every ExoPlayer requires to operate on the same thread ("Player is accessed on the wrong thread")
  // We use main thread here (Handler(context.mainLooper).post)
  //

  //

  init {
    context.addLifecycleEventListener(this)

    newInstance();
  }

  //
  // LifecycleEventListener
  //
  override fun onHostResume() {
    Log.d("PlayerVideo", "onHostResume")
  }

  override fun onHostPause() {
    Log.d("PlayerVideo", "onHostPause")

    for (instance in PlayerVideo.instances) {
      instance.stop()
    }
  }

  override fun onHostDestroy() {
    Handler(context.mainLooper).post {
      for (instance in PlayerVideo.instances) {
        instance.stop()
        instance.release()
      }
    }
  }

  //
  //
  //

  @ReactMethod
  fun newInstance() {
    // intialize player instance
    Handler(context.mainLooper).post {
      val instance = PlayerVideo(context)
      PlayerVideo.instances.add(instance)
    }
  }

  @ReactMethod
  fun load(instance: Int, url: String, isHls: Boolean) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      return
    }

    Handler(context.mainLooper).post {
      Log.d("PlayerVideo", "Load = ${url}")

      // mqt_native_modules
      Log.d("PlayerVideo", "LOOPER load = ${Looper.myLooper()}, main = ${context.mainLooper}")

      PlayerVideo.instances[instance].statusChanged = { status ->
        Log.d("PlayerVideo", "STATUS = ${status}")

        val map = Arguments.createMap()
        map.putInt("status", status.value)
        map.putInt("instance", instance)

        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("PlayerStatusChanged", map)
      }

      PlayerVideo.instances[instance].progressChanged = { progress, duration ->
        Log.d("PlayerVideo", "PROGRESS = ${progress}")

        val map = Arguments.createMap()
        map.putDouble("progress", progress)
        map.putDouble("duration", duration / 1000)
        map.putInt("instance", instance)

        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("PlayerProgressChanged", map)
      }

      PlayerVideo.instances[instance].loadVideo(url, isHls)
    }


  }

  @ReactMethod
  fun stop(instance: Int) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      return
    }

    Handler(context.mainLooper).post {
      Log.d("PlayerVideo", "STOOOOP!!")

      PlayerVideo.instances[instance].stop()

      PlayerVideo.instances[instance].statusChanged = null
    }
  }

  @ReactMethod
  fun play(instance: Int) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      return
    }

    Handler(context.mainLooper).post {
      Log.d("PlayerVideo", "PLAY")

      PlayerVideo.instances[instance].play()
    }
  }

  @ReactMethod
  fun pause(instance: Int) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      return
    }

    Handler(context.mainLooper).post {
      Log.d("PlayerVideo", "PAUSE")

      PlayerVideo.instances[instance].pause()
    }
  }

  @ReactMethod
  fun seek(instance: Int, position: Double) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      return
    }

    Handler(context.mainLooper).post {
      Log.d("PlayerVideo", "SEEK TO = ${position}")

      PlayerVideo.instances[instance].seek(position)
    }
  }

  @ReactMethod
  fun seekForward(instance: Int, time: Double) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      return
    }

    Handler(context.mainLooper).post {
      Log.d("PlayerVideo", "SEEK FORWARD by = ${time}")

      PlayerVideo.instances[instance].seekForward(time)
    }
  }

  @ReactMethod
  fun seekRewind(instance: Int, time: Double) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      return
    }

    Handler(context.mainLooper).post {
      Log.d("PlayerVideo", "SEEK FORWARD by = ${time}")

      PlayerVideo.instances[instance].seekRewind(time)
    }
  }

  @ReactMethod
  fun getDuration(instance: Int, promise: Promise) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      promise.resolve(0)
      return
    }

    Handler(context.mainLooper).post {
      val duration = PlayerVideo.instances[instance].duration / 1000
      promise.resolve(duration)
    }
  }

  @ReactMethod
  fun getProgress(instance: Int, promise: Promise) {
    if (instance < 0 || instance >= PlayerVideo.instances.size) {
      promise.resolve(0)
      return
    }

    Handler(context.mainLooper).post {
      val duration = PlayerVideo.instances[instance].progress
      promise.resolve(duration)
    }
  }
}
