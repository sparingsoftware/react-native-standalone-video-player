package com.reactnativestandalonevideoplayer


import android.content.Context
import android.os.Looper
import android.util.Log
import android.view.SurfaceView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.google.android.exoplayer2.C
import com.google.android.exoplayer2.SimpleExoPlayer
import com.google.android.exoplayer2.ui.AspectRatioFrameLayout
import com.google.android.exoplayer2.ui.PlayerView


class MyPlayerView(context: Context): PlayerView(context) {

  var playerInstance: Int = -1
  var isBound: Boolean = false

}

//

class PlayerContainerView: SimpleViewManager<MyPlayerView>() {


  init {
    // this is created only once!
    Log.d("PlayerView", "init PlayerContainerView")
  }

  override fun getName() = "RNTPlayerVideoView"

  @ReactProp(name = "isBoundToPlayer")
  fun boundToPlayer(view: MyPlayerView, isBoundToPlayer: Boolean) {
    Log.d("PlayerView", "boundToPlayer = ${isBoundToPlayer}")

    view.isBound = isBoundToPlayer

    setup(view)
  }

  @ReactProp(name = "playerInstance")
  fun setPlayerInstance(view: MyPlayerView, instance: Int) {
    Log.d("PlayerView", "playerInstance = ${instance}")

    view.playerInstance = instance

    setup(view)
  }

  private fun setup(view: MyPlayerView) {
    Log.d("PlayerView", "bind isBound=${view.isBound}, playerInstance=${view.playerInstance}")
    Log.d("PlayerView", "view = ${view}")

    if (view.playerInstance < 0 || view.playerInstance >= PlayerVideo.instances.size) {
      return
    }

    view.player = if (view.isBound) PlayerVideo.instances[view.playerInstance].player else null
    view.resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FILL
    (view.player as? SimpleExoPlayer)?.videoScalingMode = C.VIDEO_SCALING_MODE_SCALE_TO_FIT_WITH_CROPPING

    //
    if (view.isBound) {
      // we have to bind again after videoSizeChanged otherwise video ratio would be wrong
      PlayerVideo.instances[view.playerInstance].videoSizeChanged = { width, height ->
//        bind(view, true)
      }
    }
  }

  //

  override fun createViewInstance(reactContext: ThemedReactContext): MyPlayerView {
    val playerView = MyPlayerView(reactContext)

    playerView.useController = false
    playerView.resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FILL
    playerView.player = null

    Log.d("PlayerView", "createViewInstance")

    return playerView
  }

}
