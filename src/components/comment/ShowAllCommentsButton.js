import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Text } from '../../atoms/text';

const ShowAllCommentsButton = ({ value, onPress }) => {
  return (
    <TouchableOpacity
      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 17,
        marginTop: -10,
      }}
      onPress={onPress}>
      <Text
        size={14}
        color='rgba(124,124,124,1)'>
        댓글 {value}개 모두 보기
      </Text>
    </TouchableOpacity>
  );
};

export default ShowAllCommentsButton;
