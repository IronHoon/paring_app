import React from 'react';
import { debounce } from 'lodash';

import TabModal from '../../../../atoms/modal/TabModal';
import deleteComments from '../../../../net/comment/deleteComments';
import { Alert } from 'react-native';

const EditAndDeleteModal = ({ feedId, commentId, visible, onClose }) => {
  return (
    <TabModal
      visible={visible}
      onClose={onClose}>
      <TabModal.Item
        label={'삭제'}
        onPress={debounce(async () => {
          try {
            Alert.alert('삭제', '삭제된 댓글은 복구가 불가능합니다. 정말 삭제하시겠습니까?', [
              {
                text: '취소',
                style: 'cancel',
                onPress: () => {
                  onClose();
                },
              },
              {
                text: '삭제',
                onPress: async () => {
                  const response = await deleteComments(feedId, commentId);
                  onClose();
                },
              },
            ]);
          } catch (error) {
            console.warn(error);
          }
        }, 300)}
      />
    </TabModal>
  );
};

export default EditAndDeleteModal;
