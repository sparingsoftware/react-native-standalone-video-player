//
//  PlayerVideoViewManager.swift
//  StandaloneVideoPlayer
//
//  Created by Ufos on 27/10/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

@objc(RNTPlayerVideoViewManager)
class RNTPlayerVideoViewManager : RCTViewManager {
  override func view() -> UIView! {
    return PlayerVideoView();
  }
}
