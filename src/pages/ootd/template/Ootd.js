import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { withContext } from 'context-q';

import GridLayout from '../../../atoms/layout/GridLayout';
import NoData from '../../../atoms/carousel/NoData';
import { Spinner } from '../../../atoms/image';
import { WhiteSafeArea } from '../../../components/layouts';
import { usePersistentState } from '../../../hooks';
import getPosts from '../../../net/post/getPosts';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../../stores';

function Ootd(props) {
  const navigation = useNavigation();

  const [postData, setPostData] = usePersistentState('posts_ootd');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const blocks = useAtomValue(blocksAtom);

  useEffect(() => {
    getData(true);

    return () => {
      setLoading(false);
    };
  }, [props.context.user]);

  const getData = async (init = false) => {
    setLoading(true);
    try {
      const [response] = await getPosts(init ? 1 : postData.page);

      let newData = response?.data;

      // 게시물 차단 필터
      newData = newData.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'posts').map((block) => block.target_id);
        return !blockIds.includes(post.id);
      });
      // 사용자 차단 필터
      newData = newData.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'users').map((block) => block.target_id);
        return !blockIds.includes(post.user_id);
      });

      if (!init) {
        let newValue = {
          ...postData,
          lastPage: response?.lastPage,
        };

        if (!(postData.page > postData.lastPage)) {
          newValue = {
            ...postData,
            page: postData.page + 1,
            data: [...postData.data, ...newData],
          };
        }
        setPostData(newValue);
      } else {
        let newValue = {
          ...postData,
          data: newData,
          page: 2,
          lastPage: response?.lastPage,
        };
        setPostData(newValue);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (postData) {
      let filtered = postData.data.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'posts').map((block) => block.target_id);
        return !blockIds.includes(post.id);
      });
      filtered = filtered.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'users').map((block) => block.target_id);
        return !blockIds.includes(post.user_id);
      });
      setPostData({
        ...postData,
        data: filtered,
      });
    }
  }, [blocks]);

  const onEndReached = () => {
    if (loading && !(postData.page > postData.lastPage)) {
      return;
    } else {
      getData();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getData(true);
    } catch (error) {
      console.warn(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'ootd',
      },
    });
  }

  return (
    <WhiteSafeArea>
      {(!postData.data || postData.data?.length === 0) && loading && <Spinner />}
      {postData.data?.length > 0 ? (
        <GridLayout
          handlePressItem={handlePressItem}
          dataset={postData.data}
          onEndReached={onEndReached}
          ListFooterComponent={postData.page <= postData.lastPage && <Spinner />}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
        />
      ) : (
        <>{!loading && <NoData />}</>
      )}
    </WhiteSafeArea>
  );
}

export default withContext(Ootd);
