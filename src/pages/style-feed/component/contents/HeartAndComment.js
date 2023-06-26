import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { withContext } from 'context-q';
import { Text } from '../../../../atoms/text';
import { debounce } from 'lodash';

import SpaceBetweenView from '../../atoms/SpaceBetweenView';
import { Bookmark, Comment, EmptyHeart, FullBookmark, FullHeart } from '../../atoms/Icons';
import patchBookmark from '../../../../net/bookmark/patchBookmark';
import patchLike from '../../../../net/like/patchLike';

function HeartAndComment(props) {
  const { feed, userId, userEmail, pageMode, liked, setLiked, bookmarked, setBookmarked, handlePressAllComments } =
    props;
  const navigation = useNavigation();
  const [updatedLikeCount, setUpdatedLikeCount] = React.useState(props.likeCount);

  const onPressLike = debounce(async () => {
    if (liked) {
      setLiked(false);
      if (updatedLikeCount > 0) {
        setUpdatedLikeCount(updatedLikeCount - 1);
      } else {
        setUpdatedLikeCount(0);
      }
    } else {
      setLiked(true);
      setUpdatedLikeCount(updatedLikeCount + 1);
    }
    await patchLike(feed?.id);
  }, 300);

  return (
    <SpaceBetweenView style={{ marginTop: 17 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
          onPress={onPressLike}>
          <Image
            style={{ width: 24, height: 22, marginRight: 10 }}
            source={liked ? FullHeart : EmptyHeart}
          />
        </TouchableOpacity>
        <Text>{updatedLikeCount} 명이 좋아합니다.</Text>
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

            // navigation.navigate('CommentsDetail', params);
          }}>
          <Image
            style={{ width: 24, height: 24, marginRight: 21 }}
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
          <Image
            style={{ width: 23, height: 24, marginRight: 21 }}
            source={bookmarked ? FullBookmark : Bookmark}
          />
        </Pressable>
      </View>
    </SpaceBetweenView>
  );
}

HeartAndComment = withContext(HeartAndComment);

export default HeartAndComment;
