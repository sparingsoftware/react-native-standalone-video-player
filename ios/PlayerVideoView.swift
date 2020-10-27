//
//  PlayerVideoView.swift
//  iSing
//
//  Created by Ufos on 08/02/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

import UIKit
import AVKit
import AVFoundation


@objc(PlayerVideoView)
class PlayerVideoView: UIView {
  
  @objc
  var isBoundToPlayer: Bool = false {
    didSet {
      print("isBoundToPlayer = \(isBoundToPlayer) on playerInstance = \(playerInstance)")
      
      if (isBoundToPlayer) {
        bindPlayer(playerInstance: self.playerInstance)
      } else {
        unbindPlayer()
      }
    }
  }
  
  @objc
  var playerInstance: Int = 0 {
    didSet {
      print("isBoundToPlayer = \(isBoundToPlayer) on playerInstance = \(playerInstance)")
      
      if (isBoundToPlayer) {
        bindPlayer(playerInstance: self.playerInstance)
      } else {
        unbindPlayer()
      }
    }
  }
  
  //
  
  private let videoPlayerLayer: AVPlayerLayer = AVPlayerLayer()

  override init(frame: CGRect) {
      super.init(frame: frame)
      
      initialize()
  }
  
  required init?(coder: NSCoder) {
      super.init(coder: coder)
      
      initialize()
  }
  
  private func initialize() {
      backgroundColor = .clear
      
      videoPlayerLayer.videoGravity = .resizeAspectFill
      
      videoPlayerLayer.contentsScale = UIScreen.main.scale
  }
  
  //
  
  override var frame: CGRect {
      didSet {
          videoPlayerLayer.frame = bounds
      }
  }
  
  open override func layoutSubviews() {
      super.layoutSubviews()
      
      if layer.sublayers == nil || !layer.sublayers!.contains(videoPlayerLayer) {
          layer.addSublayer(videoPlayerLayer)
      }
      
      videoPlayerLayer.frame = bounds
  }
  
  //
  
  func bindPlayer(playerInstance: Int) {
    if (playerInstance < PlayerVideo.instances.count && playerInstance >= 0) {
      videoPlayerLayer.player = PlayerVideo.instances[playerInstance].player
    }
  }
  
  func unbindPlayer() {
    videoPlayerLayer.player = nil
  }
  
  
}
