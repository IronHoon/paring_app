import React from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import { Text } from '../../../atoms/text';
import { useNavigation } from '@react-navigation/native';
import createPost from '../../../net/post/createPost';
import { throttle } from 'lodash';
import patchPosts from '../../../net/post/patchPosts';

const OpenHeader = (props) => {
  const { feedId, todo, uploadType, setUploadType, title, feedData, setFeedData, handleClose } = props;
  const navigation = useNavigation();

  const uploadPost = throttle(
    React.useCallback(async () => {
      try {
        if (!feedData.feedImage) return Alert.alert('', '사진을 업로드해주세요');
        if (!feedData.content || feedData.content === '') return Alert.alert('', '내용을 입력해주세요');
        if (feedData.style === null || feedData.style < 0) return Alert.alert('', '스타일을 선택해주세요');
        if (feedData.outer === null || feedData.outer < 0) return Alert.alert('', '아우터를 선택해주세요');
        if (feedData.top === null || feedData.top < 0) return Alert.alert('', '상의를 선택해주세요');
        if (feedData.bottom === null || feedData.bottom < 0) return Alert.alert('', '하의를 선택해주세요');

        let formData = new FormData();

        formData.append('type', uploadType || 'challenge');
        formData.append('image', feedData?.feedImage || '');
        formData.append('content', feedData?.content || '');
        formData.append('style_id', feedData.style || '');
        formData.append('outer_id', feedData.outer || '');
        formData.append('top_id', feedData.top || '');
        formData.append('bottom_id', feedData.bottom || '');

        let params;
        if (todo === 'edit') {
          const [data] = await patchPosts(feedId, formData);
          params = {
            type: data?.type === 'challenge' ? 'Challenge' : 'Daily',
            feed: data,
            feedId: data?.id,
            from: 'edit',
          };

          Alert.alert('', '수정되었습니다.');

          handleClose?.();

          navigation.navigate('Ootd', {
            screen: 'Ootd',
            params: params,
          });
        } else {
          const [data] = await createPost(formData);
          params = {
            feed: data,
            feedId: data?.id,
            from: 'upload',
          };

          Alert.alert('', '게시되었습니다.');
          navigation.navigate('StyleFeed', {
            screen: 'StyleFeed',
            params: params,
          });
        }

        setFeedData({
          feedImage: null,
          content: null,
          style: null,
          outer: null,
          top: null,
          bottom: null,
        });
      } catch (error) {
        console.warn(error);
      }
    }, [
      uploadType,
      feedData.feedImage,
      feedData?.content,
      feedData?.style,
      feedData?.outer,
      feedData?.top,
      feedData?.bottom,
    ]),
    3000,
    { trailing: false },
  );

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Pressable
        hitSlop={{ top: 50, left: 50, bottom: 50, right: 50 }}
        onPress={() => {
          handleClose?.();
        }}>
        <Image
          style={{ width: 15, height: 15 }}
          source={require('../../../../assets/close.png')}
        />
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          size={17}
          style={{ color: 'rgb(0,0,0)' }}>
          데일리룩 업로드
        </Text>
      </View>
      <Pressable onPress={uploadPost}>
        <Text
          size={17}
          style={{ color: 'rgb(72,72,72)' }}>
          {todo === 'edit' ? '수 정' : '게 시'}
        </Text>
      </Pressable>
    </View>
  );
};

export default OpenHeader;
