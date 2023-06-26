import React, { useMemo } from 'react';
import { Hr, Spacer } from '../../atoms/layout';
import CommentItem from './CommentItem';
import ShowAllCommentsButton from './ShowAllCommentsButton';
import CommentInput from './CommentInput';
import styled from 'styled-components';
import AllCommentsModal from './AllCommentsModal';
import { Spinner } from '../../atoms/image';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../stores';

export const Comment = ({
  count,
  postId,
  loading,
  showAllCommentsModal,
  handleShowAllCommentsModal,
  value,
  handleRefreshComments,
}) => {
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
    <CommentsContainer style={{ opacity: loading ? 0.4 : 1 }}>
      {filtered.length === 0 && loading && <Spinner />}
      {filtered.length > 0 && (
        <>
          <Hr color='rgb(220,220,220)' />
          {filtered.slice(0, 2)?.map((x) => (
            <CommentItem
              key={`${x.id}`}
              data={x}
              ellipsis
              handleRefreshComments={handleRefreshComments}
            />
          ))}
          {count > 0 && (
            <>
              <Spacer size={17} />
              <ShowAllCommentsButton
                value={count}
                onPress={() => handleShowAllCommentsModal(true)}
              />
            </>
          )}
        </>
      )}
      <CommentInput
        postId={postId}
        handleRefreshComments={handleRefreshComments}
      />
      {showAllCommentsModal && (
        <AllCommentsModal
          value={filtered}
          postId={postId}
          visible={showAllCommentsModal}
          handleRefreshComments={handleRefreshComments}
          onClose={() => handleShowAllCommentsModal(false)}
        />
      )}
    </CommentsContainer>
  );
};

const CommentsContainer = styled.View``;
