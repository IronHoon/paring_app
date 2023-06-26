import React from 'react';
import { Alert, Image, Linking, Pressable, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { withContext } from 'context-q';

import { Text } from '../../../atoms/text';
import TabModal from '../../../atoms/modal/TabModal';
import SpaceBetweenView from '../atoms/SpaceBetweenView';
import { Instagram } from '../atoms/Icons';
import patchPosts from '../../../net/post/patchPosts';
import deletePosts from '../../../net/post/deletePosts';
import { ProfileImage } from '../../../atoms/image';
import { Spacer } from '../../../atoms/layout';
import { usePersistentState } from '../../../hooks';
import { ReportOrBlock } from '../../../components/organisms';

function FeedHeader(props) {
  const { hasBorder, feed, from, isSelected, handleEditPost } = props;
  let profileImgUri = from === 'upload' ? props?.context?.user?.avatar : feed?.user?.avatar;
  let instagram = from === 'upload' ? props?.context?.user?.instagram : feed?.user?.instagram;
  const navigation = useNavigation();
  const [visibleModal, setVisibleModal] = React.useState(false);
  const isMine = props.context?.user?.id === feed?.user?.id;

  const [, , , removeMypageItem] = usePersistentState('posts_mypage');
  const [, , , removeOotdItem] = usePersistentState('posts_ootd');
  const [, , , removeChallengeItem] = usePersistentState('posts_challenge');
  const [, , , removeDailyItem] = usePersistentState('posts_daily');

  const changeType = async () => {
    let formData = new FormData();
    try {
      setVisibleModal(false);
      formData.append('type', feed?.type === 'daily' ? 'challenge' : 'daily');
      formData.append('image', feed?.image);
      formData.append('content', feed?.content);
      formData.append('style_id', feed?.style_id);
      formData.append('outer_id', feed?.outer_id);
      formData.append('top_id', feed?.top_id);
      formData.append('bottom_id', feed?.bottom_id);

      await patchPosts(feed?.id, formData);

      navigation.navigate('Ootd', {
        screen: 'Ootd',
        params: {
          type: feed?.type === 'challenge' ? 'Challenge' : 'Daily',
          feed: feed,
          feedId: feed?.id,
          from: 'upload',
        },
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const navToUpload = () => {
    setVisibleModal(false);
    handleEditPost(true, feed);
  };

  const deleteAlertButton = () => {
    setTimeout(() => {
      Alert.alert('삭제', '삭제된 게시글은 복구가 불가능합니다. 정말 삭제하시겠습니까?', [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => {
            setVisibleModal(false);
          },
        },
        { text: '삭제', onPress: () => removePosts() },
      ]);
    }, 100);
  };

  const removePosts = async () => {
    try {
      await deletePosts(feed.id);
      setVisibleModal(false);
      Alert.alert('', '삭제되었습니다');
      removeMypageItem(feed.id);
      removeOotdItem(feed.id);
      removeChallengeItem(feed.id);
      removeDailyItem(feed.id);

      props.setBackPressParams?.() || navigation.goBack();
    } catch (error) {
      console.warn(error);
    }
  };

  const onPressProfile = () => {
    if (isMine) {
      navigation.navigate('MyPage');
    } else {
      navigation.navigate('OthersProfile', {
        screen: 'OthersProfile',
        params: { userId: feed?.user?.id },
      });
    }
  };

  return (
    <SpaceBetweenView hasBorder={hasBorder}>
      {visibleModal && (
        <TabModal
          visible={visibleModal}
          setVisible={setVisibleModal}>
          {/*<TabModal.Item*/}
          {/*  label={`${feed?.type === 'daily' ? '챌린지' : 'Like'}로 변경`}*/}
          {/*  onPress={changeType}*/}
          {/*/>*/}
          <TabModal.Item
            label={'착장 상품 선택'}
            onPress={() => {
              navigation.navigate('SelectMerchandisesPage', { postId: feed?.id });
            }}
          />
          <TabModal.Item
            label={'수정'}
            onPress={navToUpload}
          />
          <TabModal.Item
            label={'삭제'}
            onPress={deleteAlertButton}
          />
        </TabModal>
      )}

      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <ProfileImage
          source={profileImgUri}
          onPress={onPressProfile}
        />
        <Spacer width={8} />
        <Pressable
          style={{ maxWidth: 200 }}
          onPress={onPressProfile}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {from === 'upload' ? props?.context?.user?.name : feed?.user?.name}
          </Text>
        </Pressable>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          style={{ width: 25 }}
          onPress={() => {
            {
              instagram
                ? Linking.openURL('https://www.instagram.com/' + instagram)
                : Alert.alert('instagram', '인스타그램 계정이 등록되어있지 않은 사용자 입니다.');
            }
          }}>
          <Image
            style={{ height: 25, width: 25 }}
            source={Instagram}
          />
        </Pressable>
        <Spacer width={10} />
        <ReportOrBlock
          target_table={'posts'}
          target_id={feed?.id}
          isMe={isMine}
        />
        {isMine && (
          <TouchableOpacity
            style={{
              width: 25,
              height: 25,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              setVisibleModal(true);
            }}>
            <Image
              style={{ width: 12, height: 18 }}
              source={require('../../../../assets/feedMenu.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    </SpaceBetweenView>
  );
}

FeedHeader = withContext(FeedHeader);
export default FeedHeader;
