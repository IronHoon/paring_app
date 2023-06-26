import React, { useState } from 'react';
import { WhiteSafeArea } from '../../components/layouts';
import GridLayout from '../../atoms/layout/GridLayout';
import NoData from '../../atoms/carousel/NoData';
import { useNavigation } from '@react-navigation/native';
import { usePersistentState } from '../../hooks';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../stores';
import getPosts from '../../net/post/getPosts';
import { Spinner } from '../../atoms/image';
import SearchHeader from './component/SearchHeader';
import { CategoryModal } from './SearchResultPage';

export function SearchMainPage() {
  const navigation = useNavigation();

  const [_postData, setPostData] = usePersistentState('posts_ootd');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const blocks = useAtomValue(blocksAtom);
  const [searchText, setSearchText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const postData: any = _postData;

  const getData = async (init = false) => {
    setLoading(true);
    try {
      const [response] = await getPosts(init ? 1 : postData.page);

      let newData = response?.data;

      // 게시물 차단 필터
      newData = newData.filter((post: any) => {
        const blockIds = blocks.filter((block) => block.target_table === 'posts').map((block) => block.target_id);
        return !blockIds.includes(post.id);
      });
      // 사용자 차단 필터
      newData = newData.filter((post: any) => {
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
        // @ts-ignore
        setPostData(newValue);
      } else {
        let newValue = {
          ...postData,
          data: newData,
          page: 2,
          lastPage: response?.lastPage,
        };
        // @ts-ignore
        setPostData(newValue);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  function handlePressItem(item: any) {
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
      <SearchHeader
        searchText={searchText}
        setSearchText={setSearchText}
        // @ts-ignore
        setIsVisible={setIsVisible}></SearchHeader>
      {(!postData.data || postData.data?.length === 0) && loading && <Spinner />}
      {postData.data?.length > 0 ? (
        <GridLayout
          // @ts-ignore
          handlePressItem={handlePressItem}
          dataset={postData.data}
          onEndReached={onEndReached}
          ListFooterComponent={postData.page <= postData.lastPage && <Spinner />}
          refreshing={refreshing}
          // @ts-ignore
          handleRefresh={handleRefresh}
        />
      ) : (
        <>
          {!loading && (
            <NoData
              height={undefined}
              text={undefined}
              children={undefined}
            />
          )}
        </>
      )}
      <CategoryModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </WhiteSafeArea>
  );
}
