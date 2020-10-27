//
//  RNTPlayerVideoViewManager.m
//  iSing
//
//  Created by Ufos on 08/02/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//
// RNTMapManager.m


#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNTPlayerVideoViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(isBoundToPlayer, BOOL);
RCT_EXPORT_VIEW_PROPERTY(playerInstance, NSUInteger);


@end
