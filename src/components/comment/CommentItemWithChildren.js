import React from 'react';
import styled from 'styled-components';
import { withContext } from 'context-q';

import CommentItem from './CommentItem';

const CommentItemWithChildren = ({ data, handleRefreshComments, onCloseModal, onPressReply }) => {
  return (
    <Container>
      <CommentItem
        data={data}
        handleRefreshComments={handleRefreshComments}
        onCloseModal={onCloseModal}
        onPressReply={onPressReply}
      />
      {data.comments?.length > 0 && (
        <ChildrenContainer>
          {data.comments.map((v) => (
            <CommentItem
              key={v.id}
              data={v}
              handleRefreshComments={handleRefreshComments}
              onCloseModal={onCloseModal}
            />
          ))}
        </ChildrenContainer>
      )}
    </Container>
  );
};

const Container = styled.View``;
const ChildrenContainer = styled.View`
  margin-top: -3px;
  padding-left: 30px;
`;

export default withContext(CommentItemWithChildren);
