import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { withContext } from 'context-q';

import getPost from '../../net/post/getPost';
import { NavHead, WhiteSafeArea } from '../../components/layouts';
import PostRenderItem from '../../components/PostRenderItem';
import EditFeedModal from '../../components/modal/EditFeedModal';
import { Spinner } from '../../atoms/image';
import NoData from '../../atoms/carousel/NoData';
import { getStyleFeedData } from './getStyleFeedData';
import { animateHeaderWithScroll } from './animateHeaderWithScroll';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../stores';

function StyleFeedPage(props) {
  const params = props.route?.params;
  const myId = props?.context?.user?.id;
  const myEmail = props?.context?.user?.email;

  const onEndReachedCalledDuringMomentum = useRef();
  const navigation = useNavigation();
  const [feed, setFeed] = useState(null);
  const [from, setFrom] = useState(props.route?.params?.from);
  const otherUserId = props.route?.params?.otherUserId;

  const [postsData, setPostsData] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = React.useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingInit, setLoadingInit] = useState(true);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [paramsToEdit, setParamsToEdit] = useState(feed);
  const [isSelectedFiltered, setIsSelectedFiltered] = useState(false);
  const blocks = useAtomValue(blocksAtom);

  useFocusEffect(
    useCallback(() => {
      setFeed(props.route?.params?.feed);
      setFrom(props.route?.params?.from);
      getPostsData();
      return () => {
        init();
      };
    }, [props.route, props.route?.params]),
  );

  const init = (params) => {
    setFeed(null);
    setFrom(null);
    setLoading(true);
    setLoadingInit(true);
    setPostsData(null);
    setPage(1);
    setLastPage(1);
    setIsSelectedFiltered(false);
  };

  const filterAndSetData = async (data) => {
    let posts = [];

    if (!isSelectedFiltered) {
      //filter selected item
      posts = data.filter((item) => {
        if (item.post_id) return item.post_id !== (feed?.id || props.route?.params?.feed?.id);
        else return item.id !== (feed?.id || props.route?.params?.feed?.id);
      });

      const filtered = posts.length !== data.length;
      if (filtered) {
        setIsSelectedFiltered(true); // stop filtering
      }
    } else {
      posts = data;
    }

    if (page === 1) {
      let _selectedPostData;
      const _feed = props.route?.params?.feed;
      if (_feed?.id) {
        const [data] = await getPost(_feed.id);
        _selectedPostData = data;
      }

      setPage(page + 1);

      let result = [_selectedPostData, ...(postsData || []), ...posts];
      result = result.map((x) => {
        let y = { ...x };
        y.params = {
          myId: myId,
          myEmail: myEmail,
          isSelected: _selectedPostData.id === x.id,
          handleEditPost: handleEditPost,
          setBackPressParams: setBackPressParams,
        };
        return y;
      });

      setPostsData(result);
    } else {
      if (lastPage && !(page > lastPage)) {
        setPage(page + 1);

        let result = [...(postsData || []), ...posts];
        result = result.map((x) => {
          let y = { ...x };
          y.params = {
            myId: myId,
            myEmail: myEmail,
            isSelected: false,
            handleEditPost: handleEditPost,
            setBackPressParams: setBackPressParams,
          };
          return y;
        });

        setPostsData(result);
      }
    }
  };

  useEffect(() => {
    if (postsData) {
      // 게시물 차단 필터
      let filtered = postsData.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'posts').map((block) => block.target_id);
        return !blockIds.includes(post.id);
      });
      // 사용자 차단 필터
      filtered = filtered.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'users').map((block) => block.target_id);
        return !blockIds.includes(post.user_id);
      });
      setPostsData(filtered);
    }
  }, [blocks]);

  const getPostsData = async () => {
    setLoading(true);
    try {
      let apiData = await getStyleFeedData(from || props.route?.params?.from, {
        props: props,
        lastPage: lastPage,
        setLastPage: setLastPage,
        page: page,
        otherUserId: otherUserId,
      });

      if (apiData?.posts) {
        setLastPage(apiData.lastPage);
        filterAndSetData(apiData?.posts);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoadingInit(false);
      setLoading(false);
    }
  };

  const onEndReached = () => {
    if (loading && !(page > lastPage)) {
      return false;
    } else {
      getPostsData();
    }
  };

  const handleEditPost = (boolean = true, params) => {
    if (params) setParamsToEdit(params);
    setOpenEditModal(boolean);
  };

  const setBackPressParams = () => {
    const from = props.route?.params?.from;
    const ootdPages = ['daily', 'merchandise', 'ranking', 'visualDirector', 'bookmark'];
    let fromOotd;
    ootdPages.map((v, i) => {
      if (v === from) {
        fromOotd = true;
      }
    });

    if (fromOotd) {
      //#ootd탭에서 왔을 시, activeTab 업데이트. (goback 대신 navigate사용 시 페이지 갇힘현상 주의)
      if (navigation.canGoBack()) {
        props.context.update({
          ...props.context,
          ootdActiveTab: from || 'ootd',
        });
        navigation.goBack();
      } else {
        navigation.navigate('Home');
      }
    } else {
      navigation.goBack(null);
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', setBackPressParams);
      return () => BackHandler.removeEventListener('hardwareBackPress', setBackPressParams);
    }, []),
  );

  const [animatedTransformY, animatedOpacity, checkHeaderScrolled] = animateHeaderWithScroll();
  return (
    <WhiteSafeArea>
      {loadingInit ? (
        <>
          <NavHead
            onLeftPress={() => {
              setBackPressParams?.();
            }}
          />
          <Spinner />
        </>
      ) : (
        <>
          <Animated.View
            style={[
              styles.header,
              {
                transform: [{ translateY: animatedTransformY }],
                opacity: animatedOpacity,
              },
            ]}>
            <NavHead
              onLeftPress={() => {
                setBackPressParams?.();
              }}
            />
          </Animated.View>
          {postsData?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={postsData}
              renderItem={PostRenderItem}
              keyExtractor={(item, index) => `${index}_${item.id}`}
              ListFooterComponent={lastPage && page <= lastPage ? <Spinner /> : <></>}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              onEndReached={(e) => {
                if (!onEndReachedCalledDuringMomentum.current) {
                  onEndReached(e); // LOAD MORE DATA
                  onEndReachedCalledDuringMomentum.current = true;
                }
              }}
              onScroll={checkHeaderScrolled}
              contentContainerStyle={{ paddingTop: 44 }}
              windowSize={12}
              disableVirtualization={false}
              legacyImplementation={true}
              scrollEventThrottle={16}
              initialNumToRender={10}
              onEndReachedThreshold={0.25}
            />
          ) : (
            <>{loading || postsData === null ? <Spinner /> : <NoData />}</>
          )}
        </>
      )}

      {/*Modal : Edit post*/}
      {openEditModal && (
        <EditFeedModal
          todo={'edit'}
          feed={paramsToEdit}
          visible={openEditModal}
          route={props.route}
          handleVisible={handleEditPost}
        />
      )}
    </WhiteSafeArea>
  );
}

const styles = {
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    // top:Platform.OS === 'ios'? 44:0,
    top: 0,
    width: '100%',
    zIndex: 1,
  },
};

StyleFeedPage = withContext(StyleFeedPage);
export default StyleFeedPage;
