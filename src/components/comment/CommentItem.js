import React, { useCallback, useState } from 'react';
import { Alert, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import moment from 'moment';
import 'moment/locale/ko';
import { withContext } from 'context-q';

import { ProfileImage } from '../../atoms/image';
import { Row, Spacer } from '../../atoms/layout';
import { Text } from '../../atoms/text';
import { CommentMore } from '../../pages/style-feed/atoms/Icons';
import EditAndDeleteModal from '../../pages/style-feed/component/modals/EditAndDeleteModal';
import { useAtom } from 'jotai';
import { blocksAtom } from '../../stores';
import post from '../../net/core/post';
import { API_HOST } from '@env';

moment.locale('ko');

const CommentItem = ({
  data,
  handleRefreshComments,
  onPressReply,
  ellipsis = false,
  onCloseModal = () => {},
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const isMine = props.context.user.id === data.user_id;

  const onPressMenu = () => {
    setShowModal(true);
  };

  const moveToProfile = (_userId) => {
    if (onCloseModal) {
      onCloseModal();
    }
    if (!isMine) {
      navigation.navigate('OthersProfile', {
        screen: 'OthersProfile',
        params: { userId: _userId },
      });
    } else {
      navigation.navigate('MyPage', {
        screen: 'MyPage',
        params: { userId: _userId },
      });
    }
  };

  const [blocks, setBlocks] = useAtom(blocksAtom);
  const block = useCallback(async (commentId) => {
    try {
      Alert.alert('댓글 차단', '이 댓글을 차단하시겠습니까?', [
        {
          text: '취소',
        },
        {
          text: '차단',
          onPress: async () => {
            const [block] = await post(`${API_HOST}/v1/blocks`, {
              target_table: 'comments',
              target_id: commentId,
            });
            setBlocks([...blocks, block]);
            Alert.alert('완료', '차단되었습니다.');
          },
        },
      ]);
    } catch (error) {
      console.warn(error);
    }
  }, []);

  return (
    <Container>
      <ProfileImage
        source={data.user.avatar}
        onPress={() => moveToProfile(data.user_id)}
      />
      <TextContainer>
        <Row centered>
          <Row
            centered
            style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                moveToProfile(data.user_id);
              }}>
              <Name numberOfLines={1}>{data?.user?.name}</Name>
            </TouchableOpacity>
            <Time>{moment(data?.created_at, 'YYYY-MM-DD hh:mm:ss').fromNow()}</Time>
            {onPressReply && (
              <Pressable
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                onPress={() => onPressReply(data)}>
                <Text
                  size={12}
                  color='#7c7c7c'>
                  답글 달기
                </Text>
              </Pressable>
            )}
            {/*<Pressable style={{ marginLeft: 8 }}>*/}
            {/*  <Text size={12} color={'#7c7c7c'}>*/}
            {/*    신고*/}
            {/*  </Text>*/}
            {/*</Pressable>*/}
            <Pressable
              style={{ marginLeft: 8 }}
              onPress={() => block(data.id)}>
              <Text
                size={12}
                color={'#7c7c7c'}>
                차단
              </Text>
            </Pressable>
          </Row>
          {isMine && (
            <MenuButton
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={onPressMenu}>
              <ThreeDots
                resizeMode={'contain'}
                source={CommentMore}
              />
            </MenuButton>
          )}
        </Row>
        <Spacer size={4} />
        <Content
          numberOfLines={ellipsis ? 7 : null}
          size={15}>
          {data?.content}
        </Content>
        {isMine && showModal && (
          <EditAndDeleteModal
            commentId={data.id}
            feedId={data.post_id}
            visible={showModal}
            onClose={() => {
              setShowModal(false);
              handleRefreshComments();
            }}
          />
        )}
      </TextContainer>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: 14px;
`;
const TextContainer = styled.View`
  flex: 1;
  margin-left: 10px;
  margin-top: -2px;
`;
const Name = styled.Text`
  max-width: 180px;
  font-size: 18px;
  line-height: 20px;
`;
const Time = styled.Text`
  color: #7c7c7c;
  margin-left: 10px;
  margin-right: 13px;
  font-size: 12px;
`;
const ThreeDots = styled.Image`
  width: 12px;
  height: 12px;
`;
const Content = styled(Text)`
  padding-right: 30px;
  line-height: 17px;
`;
const MenuButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;

export default withContext(CommentItem);
