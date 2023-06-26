import React, { useCallback, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GridLayout from '../../../atoms/layout/GridLayout';
import { Spinner } from '../../../atoms/image';
import { withContext } from 'context-q';

import getPosts from '../../../net/post/getPosts';
import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import NoData from '../../../atoms/carousel/NoData';
import { Button } from '../../../atoms/button';
import { Spacer } from '../../../atoms/layout';

function SearchPage(props) {
  const { searchFilter, setVisibleModal } = props;
  const { searching, setSearching } = props;
  const [loading, setLoading] = React.useState(false);
  const [postsData, setPostsData] = React.useState([]);

  const page = useRef();
  const lastPage = useRef();
  // const postsData = useRef();

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          if (searching) {
            init();
            await getPostsData();
          }
        } catch (error) {
          console.warn(error);
        }
      })();
    }, [searching]),
  );

  const init = () => {
    setLoading(true);
    page.current = 1;
    lastPage.current = 1;
    // postsData.current = [];
    setPostsData([]);
    setSearching(false);
  };

  const onEndReached = () => {
    if (loading && !(page.current > lastPage.current)) {
      return;
    } else {
      getPostsData();
    }
  };

  const getPostsData = async () => {
    try {
      const [data] = await getPosts(page.current, '', {
        style_id: searchFilter?.style,
        gender_id: searchFilter?.gender,
        body_type_id: searchFilter?.body,
        height_id: searchFilter?.height,
        outer_id: searchFilter?.outer,
        top_id: searchFilter?.top,
        bottom_id: searchFilter?.bottom,
      });
      lastPage.current = data?.lastPage;
      let posts = data?.data;

      if (page.current === 1) {
        setPostsData([...posts]);
        page.current += 1;
      } else {
        if (!(page.current > data?.lastPage)) {
          page.current += 1;
          setPostsData([...postsData, ...posts]);
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handlePressItem = (item) => {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        searchFilter: searchFilter,
        from: 'search',
      },
    });
  };

  return (
    <WhiteSafeArea>
      {(!postsData || postsData?.length === 0) && loading && <Spinner />}
      {postsData?.length > 0 ? (
        <GridLayout
          useFlatlist
          handlePressItem={handlePressItem}
          dataset={postsData}
          onEndReached={onEndReached}
          ListFooterComponent={page.current <= lastPage.current && <Spinner />}
        />
      ) : (
        <>
          <NoData text={'검색결과가 없습니다.'}>
            <Spacer size={20} />
            <Button
              fontSize={14}
              onPress={() => {
                setVisibleModal(true);
              }}>
              재검색
            </Button>
          </NoData>
        </>
      )}
    </WhiteSafeArea>
  );
}

SearchPage = withContext(SearchPage);
export default SearchPage;
