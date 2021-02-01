package com.reactnativestandalonevideoplayer

import android.content.Context
import android.net.Uri
import android.os.Handler
import android.util.Log
import com.google.android.exoplayer2.C
import com.google.android.exoplayer2.ExoPlaybackException
import com.google.android.exoplayer2.Player
import com.google.android.exoplayer2.SimpleExoPlayer
import com.google.android.exoplayer2.source.ExtractorMediaSource
import com.google.android.exoplayer2.source.MediaSource
import com.google.android.exoplayer2.source.ProgressiveMediaSource
import com.google.android.exoplayer2.source.hls.HlsMediaSource
import com.google.android.exoplayer2.upstream.DataSource
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory
import com.google.android.exoplayer2.util.Util
import com.google.android.exoplayer2.video.VideoListener


//


class PlayerVideo(val context: Context) {


  private var status: PlayerVideoStatus = PlayerVideoStatus.none

  private var progressHandler: Handler? = null
  private var progressRunnable: Runnable? = null

  private val PROGRESS_UPDATE_TIME: Long = 1000

  //

  val player = SimpleExoPlayer.Builder(context).build()

  var autoplay: Boolean = true

  var statusChanged: ((status: PlayerVideoStatus) -> Unit)? = null

  var progressChanged: ((progress: Double, duration: Double) -> Unit)? = null

  var videoSizeChanged: ((width: Int, height: Int) -> Unit)? = null

  var currentStatus: PlayerVideoStatus
    get() = status
    set(value) {}

  var isPlaying: Boolean
    get() = status == PlayerVideoStatus.playing
    set(value) {}

  var isLoaded: Boolean
    get() = status == PlayerVideoStatus.playing || status == PlayerVideoStatus.paused || status == PlayerVideoStatus.loading
    set(value) {}

  var isLoading: Boolean
    get() = status == PlayerVideoStatus.loading
    set(value) {}

  var volume: Float
    get() = player.volume
    set(value) { player.volume = value }

  var duration: Double
    get() {
      if (player.duration == C.TIME_UNSET) {
        Log.d("PlayerVideo", "DURRRRR: TIME_UNSET")
        return 0.0
      }

      val dur = player.duration.toDouble()

      Log.d("PlayerVideo", "DURRRRR: ${dur}")
      return dur
    }
    set(value){}

  var position: Double
    get() = player.currentPosition.toDouble()
    set(value){}

  var progress: Double
    get() {
      if (player.duration > 0) {
        return player.currentPosition.toDouble() / player.duration.toDouble()
      }

      return 0.0
    }
    set(value) {}

  //

  fun loadVideo(url: String, isHls: Boolean, loop: Boolean) {
    Log.d("PlayerVideo", "load = ${url}")

    // Produces DataSource instances through which media data is loaded.
    val dataSourceFactory: DataSource.Factory = DefaultDataSourceFactory(
      context,
      Util.getUserAgent(context, context.packageName)
    )

    // This is the MediaSource representing the media to be played.
    val hlsMediaSource = HlsMediaSource.Factory(dataSourceFactory)
      .createMediaSource(Uri.parse(url))

    val httpMediaSource = ProgressiveMediaSource.Factory(dataSourceFactory)
      .createMediaSource(Uri.parse(url))

    val mediaSource = if(isHls) hlsMediaSource else httpMediaSource

    // Prepare the player with the source.
    player.prepare(mediaSource)

    player.playWhenReady = autoplay
    player.repeatMode = if(loop) Player.REPEAT_MODE_ALL else Player.REPEAT_MODE_OFF
    player.videoScalingMode = C.VIDEO_SCALING_MODE_SCALE_TO_FIT_WITH_CROPPING

    setStatus(PlayerVideoStatus.new)

    // listeners
    player.addListener(object: Player.EventListener {
      override fun onPlayerStateChanged(playWhenReady: Boolean, playbackState: Int) {
        Log.d("PlayerVideo", "onPlayerStateChanged = ${playbackState}")

        when(playbackState) {
          Player.STATE_IDLE -> setStatus(PlayerVideoStatus.none)
          Player.STATE_BUFFERING -> setStatus(PlayerVideoStatus.loading)
          Player.STATE_READY -> setStatus(if(player.playWhenReady) PlayerVideoStatus.playing else PlayerVideoStatus.paused)
          Player.STATE_ENDED -> {
            setStatus(PlayerVideoStatus.finished)
            stopProgressTimer()
          }
        }
      }
    })

    player.addVideoListener(object: VideoListener {
      override fun onVideoSizeChanged(width: Int, height: Int, unappliedRotationDegrees: Int, pixelWidthHeightRatio: Float) {
        Log.d("PlayerView", "onVideoSizeChanged width=${width}, height=${height}")
        videoSizeChanged?.invoke(width, height)
      }
    })

    startProgressTimer()
  }

  fun play() {
    Log.d("PlayerVideo", "play")

    if (status === PlayerVideoStatus.finished) {
      seek(0.0)
    }

    player.playWhenReady = true

    startProgressTimer()
  }

  fun pause() {
    Log.d("PlayerVideo", "pause")

    player.playWhenReady = false

    stopProgressTimer()
  }

  fun stop() {
    Log.d("PlayerVideo", "stop")

    player.stop()

    setStatus(PlayerVideoStatus.stopped)

    stopProgressTimer()
  }

  fun seek(progress: Double) {
    Log.d("PlayerVideo", "seek: ${progress}")

    player.seekTo((duration * progress).toLong())
  }

  fun seekForward(time: Double) {
    Log.d("PlayerVideo", "Seek forward position=${position}, by=${time*1000}")

    player.seekTo((position + time*1000).toLong())
  }

  fun seekRewind(time: Double) {
    Log.d("PlayerVideo", "Seek rewind position=${position}, by=${time*1000}")

    player.seekTo((position - time * 1000).toLong())
  }

  fun release() {
    player.release()
  }

  //
  // Private
  //


  private fun setStatus(newStatus: PlayerVideoStatus) {
    status = newStatus

    Log.d("PlayerVideo", "NEW status = ${status}")

    statusChanged?.invoke(status)

    if (status == PlayerVideoStatus.stopped || status == PlayerVideoStatus.none || status == PlayerVideoStatus.error) {
      stopProgressTimer()
    }
  }

  private fun startProgressTimer() {
    progressHandler = Handler()

    progressRunnable = Runnable {
      progressChanged?.invoke(progress, duration)

      progressHandler?.postDelayed(progressRunnable, PROGRESS_UPDATE_TIME)
    }

    progressHandler?.postDelayed(progressRunnable, 0)
  }

  private fun stopProgressTimer() {
    progressHandler?.removeCallbacks(progressRunnable)
  }

  //

  companion object {
    var instances: MutableList<PlayerVideo> = mutableListOf()
  }
}


enum class PlayerVideoStatus(val value: Int) {
  new(0),
  loading(1),
  playing(2),
  paused(3),
  error(4),
  stopped(5), // stopped by the user
  none(6),
  finished(7) // done playing
}

fun printPlayerStatus(status: PlayerVideoStatus) : String {
  return ""
}

