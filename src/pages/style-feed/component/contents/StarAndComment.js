import React from 'react';
import FastImage from 'react-native-fast-image';
import { Pressable, View } from 'react-native';

import { Text } from '../../../../atoms/text';
import SpaceBetweenView from '../../atoms/SpaceBetweenView';
import { Bookmark, Comment, FullBookmark, SmallFullStar } from '../../atoms/Icons';
import patchBookmark from '../../../../net/bookmark/patchBookmark';

function StarAndComment(props) {
  const { bookmarked, setBookmarked, averageStar, handlePressAllComments, commentCount } = props;
  const { feed, userId, userEmail, pageMode } = props;

  return (
    <SpaceBetweenView style={{ marginTop: 17 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FastImage
          resizeMode={'contain'}
          style={{ width: 30, height: 27, marginRight: 10 }}
          source={SmallFullStar}
        />
        <Text size={21}>{averageStar}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => {
            let params;
            if (pageMode === 'detail') {
              params = {
                userId: userId,
                userEmail: userEmail,
                feed: feed,
                pageMode: 'detail',
              };
            } else {
              params = { userId: userId, userEmail: userEmail, feed: feed };
            }

            handlePressAllComments(params, true);
          }}>
          <FastImage
            resizeMode={'contain'}
            style={{ width: 24, height: 24, marginRight: 20 }}
            source={Comment}
          />
        </Pressable>
        <Pressable
          onPress={async () => {
            await patchBookmark(feed?.id);

            if (bookmarked) {
              setBookmarked(false);
            } else {
              setBookmarked(true);
            }
          }}>
          <FastImage
            resizeMode={'contain'}
            style={{ width: 23, height: 24, marginRight: 20 }}
            source={bookmarked ? FullBookmark : Bookmark}
          />
        </Pressable>
      </View>
    </SpaceBetweenView>
  );
}

export default StarAndComment;
