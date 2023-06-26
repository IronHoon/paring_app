import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { withContext } from 'context-q';

import { WhiteSafeArea } from '../../../components/layouts';
import GridLayout from '../../../atoms/layout/GridLayout';
import { Spinner } from '../../../atoms/image';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../../stores';
import { fetcher } from '../../../net/core/useFetch';
import { API_HOST } from '@env';
import useSWRInfinite from 'swr/infinite';
import SwrContainer from '../../../components/layouts/SwrContainer';

const getKey = (pageIndex, previousPageData) => {
  return `${API_HOST}/v1/posts?page=${pageIndex + 1}&type=Challenge`;
};

function DailyLookPage(props) {
  const navigation = useNavigation();
  const blocks = useAtomValue(blocksAtom);
  const { data, size, setSize, error, mutate, isLoading } = useSWRInfinite(getKey, fetcher);
  const listData = useMemo(() => {
    if (!data) return [];
    const list = [];
    for (let i = 0; i < data.length; i++) {
      list.push(...data[i].data);
    }

    // 게시물 차단 필터
    let filtered = list.filter((post) => {
      const blockIds = blocks.filter((block) => block.target_table === 'posts').map((block) => block.target_id);
      return !blockIds.includes(post.id);
    });
    // 사용자 차단 필터
    filtered = filtered.filter((post) => {
      const blockIds = blocks.filter((block) => block.target_table === 'users').map((block) => block.target_id);
      return !blockIds.includes(post.user_id);
    });

    return filtered;
  }, [data, blocks]);

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'challenge',
      },
    });
  }

  return (
    <WhiteSafeArea>
      <SwrContainer
        data={listData}
        error={error}>
        {listData && (
          <GridLayout
            handlePressItem={handlePressItem}
            dataset={listData}
            onEndReached={() => setSize(size + 1)}
            ListFooterComponent={isLoading && <Spinner />}
            // refreshing={refreshing}
            handleRefresh={mutate}
          />
        )}
      </SwrContainer>
    </WhiteSafeArea>
  );
}

export default withContext(DailyLookPage);
