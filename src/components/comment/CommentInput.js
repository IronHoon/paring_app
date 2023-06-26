import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';

import createComments from '../../net/comment/createComments';

import { Text } from '../../atoms/text';

const CommentInput = ({ autoFocus, replyData, postId, handleRefreshComments, handleReply = () => {} }) => {
  const textRef = useRef();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (replyData) {
      textRef.current.focus();
    } else {
      textRef.current.blur();
      setValue('');
    }
  }, [replyData]);

  const onPressPost = async () => {
    setLoading(true);
    try {
      if (replyData) {
        await createComments(postId, value, replyData.id);
        handleRefreshComments();
        handleReply(null);
      } else {
        await createComments(postId, value);
        handleRefreshComments();
      }
      setValue('');
      handleReply(null);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Input
        ref={textRef}
        autoFocus={autoFocus}
        autoCapitalize='none'
        autoCorrect={false}
        editable={!loading}
        multiline={true}
        maxLength={200}
        placeholder={!!replyData ? '@' + replyData.user?.name : '댓글 달기'}
        onChangeText={(text) => {
          setValue(text);
        }}
        defaultValue={value}
      />
      <TouchableOpacity
        disabled={loading || value?.length === 0}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        onPress={() => onPressPost(value)}>
        <Text
          size={14}
          color={loading || value?.length === 0 ? 'rgba(124,124,124, 0.3)' : 'rgba(124,124,124,1)'}>
          게시
        </Text>
      </TouchableOpacity>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 7px;
  border-radius: 10px;
  background-color: rgba(238, 238, 238, 1);
`;
const Input = styled.TextInput`
  width: 90%;
  height: 40px;
  padding-left: 10px;
  padding-right: 7px;
  line-height: 24px;
`;

export default CommentInput;
