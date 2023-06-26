import { WhiteSafeArea } from '../../../components/layouts';
import { FlatList, Text, View } from 'react-native';
import { fetcher, useFetch } from '../../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../../components/layouts/SwrContainer';
import { Spinner } from '../../../atoms/image';
import { MerchandiseItemWithPost } from '../../../molecules/MerchandiseItemWithPost';
import React, { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';

const getKey = (pageIndex: number, previousPageData: any[]) => {
  return `${API_HOST}/v1/search/merchandises?page=${pageIndex + 1}&query=`;
};

export function MerchandiseList() {
  const { data, size, setSize, error, mutate, isLoading } = useSWRInfinite(getKey, fetcher, { parallel: true });
  const listData = useMemo(() => {
    if (!data) return [];
    const list = [];
    for (let i = 0; i < data.length; i++) {
      list.push(...data[i].data);
    }
    return list;
  }, [data]);
  return (
    <WhiteSafeArea>
      <SwrContainer
        data={data}
        error={error}>
        {data && (
          <>
            {listData?.length > 0 ? (
              <View style={{ flex: 1 }}>
                <FlatList
                  data={listData}
                  numColumns={2}
                  onEndReached={async () => setSize(size + 1)}
                  // @ts-ignore
                  ListFooterComponent={isLoading && <Spinner />}
                  renderItem={({ item, index }) => (
                    <MerchandiseItemWithPost
                      item={item}
                      index={index}
                      searchTxt={''}
                    />
                  )}></FlatList>
              </View>
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>검색결과가 없습니다.</Text>
              </View>
            )}
          </>
        )}
      </SwrContainer>
    </WhiteSafeArea>
  );
}
