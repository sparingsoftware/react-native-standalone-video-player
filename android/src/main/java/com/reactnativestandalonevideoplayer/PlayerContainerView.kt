package com.reactnativestandalonevideoplayer


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

class PlayerContainerView: SimpleViewManager<PlayerView>() {

  private lateinit var playerView: PlayerView

  private var playerInstance: Int = 0
  private var isBound: Boolean = false

  //

  override fun getName() = "RNTPlayerVideoView"

  @ReactProp(name = "isBoundToPlayer")
  fun boundToPlayer(view: PlayerView, isBoundToPlayer: Boolean) {
    Log.d("PlayerView", "isBoundToPlayer = ${isBoundToPlayer}, playerInstance=${playerInstance}")

    isBound = isBoundToPlayer

    bind(view, isBound)
  }

  @ReactProp(name = "playerInstance")
  fun setPlayerInstance(view: PlayerView, instance: Int) {
    Log.d("PlayerView", "playerInstance = ${instance}")

    playerInstance = instance

    bind(view, isBound)
  }

  private fun bind(view: PlayerView, isBound: Boolean) {
    Log.d("PlayerView", "bind isBound=${isBound}, playerInstance=${playerInstance}")

    view.player = if (isBound && playerInstance >= 0) PlayerVideo.instances[playerInstance].player else null
    view.resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FILL
    (view.player as? SimpleExoPlayer)?.videoScalingMode = C.VIDEO_SCALING_MODE_SCALE_TO_FIT_WITH_CROPPING
    
    //
    if (isBound) {
      // we have to bind again after videoSizeChanged otherwise video ratio would be wrong
      PlayerVideo.instances[playerInstance].videoSizeChanged = { width, height ->
        bind(view, true)
      }
    }
  }

  //

  override fun createViewInstance(reactContext: ThemedReactContext): PlayerView {
    playerView = PlayerView(reactContext)

    playerView.useController = false
    playerView.resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FILL
    playerView.player = null

    Log.d("PlayerView", "createViewInstance")

    return playerView
  }

}
