import React, { useMemo, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components';
import Modal from 'react-native-modal';

import { NavHead } from '../layouts';
import CommentInput from './CommentInput';
import CommentItemWithChildren from './CommentItemWithChildren';
import { Text } from '../../atoms/text';
import COLOR from '../../../constants/COLOR';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../stores';

const AllCommentsModal = ({ postId, value = [], visible, handleRefreshComments, onClose }) => {
  const [replyData, setReplyData] = useState(null);

  const onPressReply = (_data) => {
    setReplyData(_data);
  };
  const onPressCancelReply = () => {
    setReplyData(null);
  };

  const blocks = useAtomValue(blocksAtom);
  const filtered = useMemo(() => {
    let _filtered = value.filter((post) => {
      const blockIds = blocks.filter((block) => block.target_table === 'comments').map((block) => block.target_id);
      return !blockIds.includes(post.id);
    });
    _filtered = _filtered.filter((post) => {
      const blockIds = blocks.filter((block) => block.target_table === 'users').map((block) => block.target_id);
      return !blockIds.includes(post.user_id);
    });
    return _filtered;
  }, [value, blocks]);

  return (
    <Modal
      animationType='slide'
      isVisible={visible}
      style={{ margin: 0 }}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <Container
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <NavHead onLeftPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}>
          <MainContainer>
            <List>
              {value.length > 0 && (
                <KeyboardAwareFlatList
                  style={{ flex: 1 }}
                  initialNumToRender={10}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps='always'
                  keyExtractor={(x) => `${x.id}`}
                  data={filtered}
                  renderItem={({ item }) => (
                    <CommentItemWithChildren
                      data={item}
                      handleRefreshComments={handleRefreshComments}
                      onCloseModal={onClose}
                      onPressReply={onPressReply}
                    />
                  )}
                />
              )}
            </List>
            <InputContainer>
              {replyData && (
                <ReplyTextContainer>
                  <Text
                    size={13}
                    color={COLOR.LIGHT_GRAY}>
                    {replyData.user.name}님에게 답글 달기
                  </Text>
                  <CancelButton onPress={onPressCancelReply}>
                    <Image
                      style={{ width: 12, height: 12 }}
                      source={require('../../../assets/close.png')}
                    />
                  </CancelButton>
                </ReplyTextContainer>
              )}
              <CommentInput
                autoFocus
                replyData={replyData}
                postId={postId}
                handleReply={(v) => setReplyData(v)}
                handleRefreshComments={handleRefreshComments}
              />
            </InputContainer>
          </MainContainer>
        </KeyboardAvoidingView>
      </Container>
    </Modal>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const MainContainer = styled.View`
  flex: 1;
  padding: 8px;
`;

const List = styled.View`
  flex: 1;
`;
const InputContainer = styled.View`
  padding: 8px 0;
`;
const ReplyTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 8px;
`;
const CancelButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 30px;
`;

export default AllCommentsModal;
