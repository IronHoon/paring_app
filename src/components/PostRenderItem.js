import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
import { withContext } from 'context-q';
import { useFocusEffect } from '@react-navigation/native';

import getBookmark from '../net/bookmark/getBookmark';
import getComments from '../net/comment/getComments';
import getCommentCount from '../net/comment/getCommentCount';
import getLike from '../net/like/getLike';
import getPairingIndex from '../net/pairing-index/getPairingIndex';
import getRating from '../net/rating/getRating';

import { Text } from '../atoms/text';
import { deviceWidth, Spacer } from '../atoms/layout';
import PressableOndemandImage from '../atoms/image/PressableOndemandImage';
import COLOR from '../../constants/COLOR';
import FeedHeader from '../pages/style-feed/component/FeedHeader';
import Indices from '../pages/style-feed/component/Indices';
import VoteStar from '../pages/style-feed/component/contents/VoteStar';
import StarAndComment from '../pages/style-feed/component/contents/StarAndComment';
import HeartAndComment from '../pages/style-feed/component/contents/HeartAndComment';
import Statistics from '../pages/style-feed/component/contents/Statistics';
import ContentsArea from '../pages/style-feed/component/contents/ContentsArea';
import RecommendArea from '../pages/style-feed/component/RecommendArea';
import { Comment } from './comment/Comment';
import { MerchandisesForPost } from './MerchandisesForPost';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageViewerModal } from './modal';

const styles = {
  inspect: {
    zIndex: 100,
    position: 'absolute',
    bottom: 15,
    right: 21,
    height: 30,
    paddingLeft: 8,
    paddingRight: 7,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const Wrapper = styled.View`
  border-bottom-width: 9px;
  border-color: rgb(238, 238, 238);
  padding-top: 9px;
  padding-bottom: 25px;
  padding-left: 16px;
  padding-right: 16px;
`;

const PostRenderItem = ({ item = {}, index, context }) => {
  const {
    myId,
    myEmail,
    isSelected, // 게시글 하단에 붙여진 데이터가 아닌, 선택된 게시글 인지
    setActiveTab,
    handleEditPost,
    setBackPressParams,
  } = item.params || {};

  const postId = item.id;
  const isMine = myId === item?.user_id || myId === item?.user?.id;
  const likeCount = item?.__meta__?.likes_count || 0;
  const averageStar = item?.ratings_average;
  const insets = useSafeAreaInsets();
  const topOffset = insets.top;

  const [spreadContent, setContent] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [pairingIndex, setPairingIndex] = useState(0);
  const [commentsData, setCommentsData] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [refreshComment, setRefreshComment] = useState(false);
  const [showAllCommentsModal, setShowAllCommentsModal] = useState(false);
  const [score, setScore] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (postId) {
        fetchBookmark();
        fetchLike();
        fetchPairingIndex();
        fetchComments();
        getRatingData();
      }
    }, [postId]),
  );

  const fetchBookmark = async () => {
    try {
      const [data] = await getBookmark(postId);
      if (data?.id) {
        setBookmarked(true);
      } else {
        setBookmarked(false);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchLike = async () => {
    try {
      const [data] = await getLike(postId);
      if (data?.id) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchPairingIndex = async () => {
    try {
      const [data] = await getPairingIndex(postId);
      if (data) {
        let i = Math.floor(data * 100);
        setPairingIndex(i);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const getRatingData = async () => {
    try {
      if (postId) {
        const [data] = await getRating(postId);
        setScore(data?.value || data?.[0]?.value);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleRefreshComments = async () => {
    await fetchComments();
  };

  const fetchComments = async () => {
    setRefreshComment(true);
    try {
      const [data] = await getComments(postId);
      const [countData] = await getCommentCount(postId);
      setCommentCount(countData);
      setCommentsData(data);
    } catch (error) {
      console.warn(error);
    } finally {
      setRefreshComment(false);
    }
  };

  const handleShowAllCommentsModal = (v) => {
    setShowAllCommentsModal(v);
  };

  const [blur, setBlur] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setBlur(false);

      return () => setBlur(true);
    }, []),
  );

  return (
    <Wrapper>
      {index !== 0 && <Spacer height={25} />}
      {!blur && (
        <>
          <FeedHeader
            feed={item}
            isMine={isMine}
            setActiveTab={setActiveTab}
            isSelected={isSelected}
            handleEditPost={handleEditPost}
            setBackPressParams={setBackPressParams}
          />
          <View
            style={{
              position: 'relative',
              marginTop: 15,
              marginHorizontal: -16,
            }}>
            <PressableOndemandImage
              imgSrc={item?.image}
              width={deviceWidth}
              height={deviceWidth * 1.3}
              handlePressItem={() => setIsVisible(true)}
              noCrop={true}
              priority={FastImage.priority.high}
            />
            {!isMine && item?.type === 'challenge' && (
              <View style={styles.inspect}>
                <Text
                  size={19}
                  style={{ color: COLOR.WHITE, marginRight: 6 }}>
                  예상
                </Text>
                <Indices index={pairingIndex} />
              </View>
            )}
          </View>
        </>
      )}
      <MerchandisesForPost
        id={item?.id}
        post={item}
      />
      {item?.type === 'challenge' ? (
        <>
          <VoteStar
            feed={item}
            score={score}
          />
          <StarAndComment
            feed={item}
            userId={myId}
            userEmail={myEmail}
            averageStar={averageStar}
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
            handlePressAllComments={() => handleShowAllCommentsModal(true)}
          />
        </>
      ) : (
        <HeartAndComment
          feed={item}
          userId={myId}
          userEmail={myEmail}
          bookmarked={bookmarked}
          setBookmarked={setBookmarked}
          liked={liked}
          likeCount={likeCount}
          setLiked={setLiked}
          handlePressAllComments={() => handleShowAllCommentsModal(true)}
        />
      )}

      {isMine && item?.type === 'challenge' && <Statistics feed={item} />}
      <ContentsArea
        spread={spreadContent}
        setSpread={setContent}
        content={item?.content}
      />
      <Comment
        count={commentCount}
        loading={refreshComment}
        postId={postId}
        value={commentsData}
        showAllCommentsModal={showAllCommentsModal}
        handleShowAllCommentsModal={handleShowAllCommentsModal}
        handleRefreshComments={handleRefreshComments}
      />
      {!!context.commerce && <RecommendArea {...item} />}
      <ImageViewerModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        item={item}
      />
    </Wrapper>
  );
};

export default withContext(PostRenderItem);
