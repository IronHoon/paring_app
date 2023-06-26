import React, { useCallback, useEffect, useState } from 'react';
import { WhiteSafeArea } from '../../components/layouts';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SearchHeader from './component/SearchHeader';
import { TabMenu } from './component/TabMenu';
import { Spacer } from '../../atoms/layout';
import GridLayout from '../../atoms/layout/GridLayout';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../stores';
import { ProfileImage, Spinner } from '../../atoms/image';
import Modal from 'react-native-modal';
import COLOR from '../../../constants/COLOR';
import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../components/layouts/SwrContainer';
import FastImage from 'react-native-fast-image';
import getSearchPost from '../../net/post/getSearchPost';
import getMerchandisePost from '../../net/post/getMerchandisePost';
import getSearchUserData from '../../net/post/getSearchUserData';
import tw from 'twrnc';
import { MerchandiseItemWithPost } from '../../molecules/MerchandiseItemWithPost';

const SEARCHTAB = [
  {
    value: 'merchandise',
    label: '상품',
  },
  {
    value: 'post',
    label: '게시물',
  },
  {
    value: 'user',
    label: '계정',
  },
];

const SearchResultPage = ({ route }: any) => {
  const searchText = route?.params?.searchText;
  const [view, setView] = useState('merchandise');
  const [searchTxt, setSearchText] = useState('');
  const [isShow, setIsShow] = useState(false);
  // const [postData, setPostData] = usePersistentState('posts_ootd');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const blocks = useAtomValue(blocksAtom);
  const navigation = useNavigation();

  const [searchUserData, setSearchUserData] = useState<any>([]);
  const [searchPostData, setSearchPostData] = useState<any>([]);
  const [merchandiseList, setMerchandiseList] = useState<any>([]);

  const [postList, setPostList] = useState<any>([]);
  const [noPostList, setNoPostList] = useState<any>([]);

  const selectTab = async (value: string) => {
    setView(value);
  };

  const WIDTH = Dimensions.get('window').width;
  const { data, error, mutate } = useFetch<any>(`${API_HOST}/v1/search/merchandises?query=${searchTxt}`);
  const {
    data: postData,
    error: postError,
    mutate: postMutate,
  } = useFetch<any>(`${API_HOST}/v1/search/posts?query=${searchTxt}`);

  const {
    data: userData,
    error: userError,
    mutate: userMutate,
  } = useFetch<any>(`${API_HOST}/v1/search/users?query=${searchTxt}`);

  useEffect(() => {
    setSearchText(searchText);
    // getData()
    // getMerchandiseData()
    // getSearchUser()
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await userMutate();
        await postMutate();
        await mutate();
      })();
    }, [userMutate, postMutate, mutate]),
  );

  useEffect(() => {
    mutate();
    postMutate();
    userMutate();
    setSearchPostData(postData);
    setSearchUserData(userData);
    setMerchandiseList(data);
    //@ts-ignore
    setPostList(data?.data.filter((item) => item.posts.length != 0));
    //@ts-ignore
    setNoPostList(data?.data.filter((item) => item.posts.length === 0));
  }, [searchTxt, postData, userData, data]);

  const getMerchandiseData = async () => {
    setLoading(true);
    try {
      const [response] = await getMerchandisePost(merchandiseList?.page + 1, null, {}, searchTxt);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getSearchUser = async () => {
    setLoading(true);
    try {
      const [response] = await getSearchUserData(searchUserData?.page + 1, null, {}, searchTxt);
      let newData = response?.data;
      //@ts-ignore
      setSearchUserData({
        ...searchUserData,
        page: searchUserData?.page + 1,
        data: [...searchUserData?.data, ...newData],
      });
    } catch (e) {
      console.warn('error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getData = async (init = false) => {
    setLoading(true);
    try {
      const [response] = await getSearchPost(searchPostData?.page + 1, null, {}, searchTxt);
      let newData = response?.data;
      // // 게시물 차단 필터
      // newData = newData.filter((post) => {
      //     const blockIds = blocks
      //         .filter((block) => block.target_table === 'posts')
      //         .map((block) => block.target_id);
      //     return !blockIds.includes(post.id);
      // });
      // // 사용자 차단 필터
      // newData = newData.filter((post) => {
      //     const blockIds = blocks
      //         .filter((block) => block.target_table === 'users')
      //         .map((block) => block.target_id);
      //     return !blockIds.includes(post.user_id);
      // });

      if (!init) {
        //@ts-ignore
        setSearchPostData({
          ...searchPostData,
          page: searchPostData?.page + 1,
          data: [...searchPostData?.data, ...newData],
        });
      } else {
        //@ts-ignore
        setSearchPostData({
          ...searchPostData,
          page: searchPostData?.page + 1,
          data: [...searchPostData?.data, ...newData],
        });
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useEffect(() => {
  //     if (postData) {
  //         let filtered = postData.data.filter((post) => {
  //             const blockIds = blocks
  //                 .filter((block) => block.target_table === 'posts')
  //                 .map((block) => block.target_id);
  //             return !blockIds.includes(post.id);
  //         });
  //         filtered = filtered.filter((post) => {
  //             const blockIds = blocks
  //                 .filter((block) => block.target_table === 'users')
  //                 .map((block) => block.target_id);
  //             return !blockIds.includes(post.user_id);
  //         });
  //         setPostData({
  //             ...postData,
  //             data: filtered,
  //         });
  //     }
  // }, [blocks]);

  const onEndReached = async () => {
    // getData(false);
    if (searchPostData.page < searchPostData.lastPage) {
      await getData();
    }
    // if (loading && !(searchPostData.page > searchPostData.lastPage)) {
    //     return;
    // } else {
    //    await getData();
    // }
  };

  const onEndReachedMerchandise = async () => {
    // getData(false);
    if (searchPostData.page < searchPostData.lastPage) {
      await getMerchandiseData();
    }
  };

  const onEndReachedUser = async () => {
    // getData(false);
    if (searchPostData.page < searchPostData.lastPage) {
      await getSearchUser();
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

  //@ts-ignore
  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'searchPost',
        searchText: searchTxt,
      },
    });
  }

  return (
    <WhiteSafeArea>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SearchHeader
          searchText={searchTxt}
          setSearchText={setSearchText}
          back={true}></SearchHeader>
        <TabMenu
          menu={SEARCHTAB}
          initialValue='merchandise'
          onPress={selectTab}
          theme={'light'}
          isSearching={undefined}
          setIsSearching={undefined}
          onListRefresh={undefined}
        />
        {view === 'merchandise' && (
          <SwrContainer
            data={data}
            error={error}>
            <>
              {postList?.length > 0 ? (
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={postList}
                    numColumns={2}
                    onEndReached={() => onEndReachedMerchandise()}
                    // @ts-ignore
                    ListFooterComponent={merchandiseList?.page < merchandiseList?.lastPage && <Spinner />}
                    renderItem={({ item, index }) => (
                      <MerchandiseItemWithPost
                        item={item}
                        index={index}
                        searchTxt={searchTxt}
                      />
                    )}></FlatList>
                </View>
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>검색결과가 없습니다.</Text>
                </View>
              )}
              {noPostList?.length > 0 && (
                <View
                  style={{
                    maxHeight: 300,
                    minHeight: 45,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(243,243,243,1)',
                    backgroundColor: 'wthie',
                  }}>
                  <Pressable
                    onPress={() => {
                      setIsShow(!isShow);
                    }}
                    style={{ height: 45, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={require('../../../assets/down_ic.png')}
                      style={{ width: 20, height: 20 }}
                      resizeMode={'contain'}
                    />
                  </Pressable>
                  {isShow && (
                    <>
                      <View style={{ height: 260, width: '100%' }}>
                        <View style={{ height: 20, width: '100%', backgroundColor: 'rgba(243,243,243,1)' }}></View>
                        <FlatList
                          data={noPostList}
                          numColumns={3}
                          renderItem={({ item, index }) => {
                            //@ts-ignore
                            const price = (Number(item.price.toString().replace(/\D/g, '')) || '').toLocaleString();

                            return (
                              <Pressable
                                onPress={() => {
                                  navigation.navigate('MerchandiseDetailPage', {
                                    //@ts-ignore
                                    id: item.id,
                                  });
                                }}
                                style={{
                                  width:
                                    index % 2 === 1
                                      ? WIDTH * 0.3 + (WIDTH * 0.1) / 4
                                      : WIDTH * 0.3 + ((WIDTH * 0.1) / 4) * 1.5,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginBottom: 8,
                                  marginTop: 8,
                                  borderBottomColor: 'rgba(243,243,243,1)',
                                  borderBottomWidth: 1,
                                }}>
                                <View
                                  style={{
                                    width: WIDTH * 0.3,
                                    height: WIDTH * 0.3,
                                    backgroundColor: COLOR.LIGHT_GRAY,
                                  }}>
                                  <FastImage
                                    //@ts-ignore
                                    source={{ uri: item.images.split(',')[0] }}
                                    style={{
                                      width: WIDTH * 0.3,
                                      height: WIDTH * 0.3,
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    width: '100%',
                                    paddingLeft: (WIDTH * 0.1) / 4,
                                  }}>
                                  <Text
                                    style={{ fontSize: 14, fontWeight: 'bold' }}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'>
                                    {item.brand}
                                  </Text>
                                  <Spacer height={3} />
                                  <Text
                                    style={{ fontSize: 11, color: 'rgba(88,88,90,1)' }}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'>
                                    {item.name}
                                  </Text>
                                  <Spacer height={3} />

                                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{price + '원'}</Text>
                                </View>
                              </Pressable>
                            );
                          }}
                        />
                      </View>
                    </>
                  )}
                </View>
              )}
            </>
          </SwrContainer>
        )}
        {view === 'post' &&
          (postData?.data.length > 0 ? (
            <View style={{ flex: 1 }}>
              <GridLayout
                //@ts-ignore
                handlePressItem={handlePressItem}
                //@ts-ignore
                dataset={searchPostData?.data}
                onEndReached={onEndReached}
                ListFooterComponent={searchPostData?.page < searchPostData?.lastPage ? <Spinner /> : <></>}
                refreshing={refreshing}
                //@ts-ignore
                handleRefresh={handleRefresh}
              />
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>검색결과가 없습니다.</Text>
            </View>
          ))}
        {view === 'user' &&
          (searchUserData?.data.length > 0 ? (
            <View style={{ flex: 1, width: '100%' }}>
              <FlatList
                data={searchUserData?.data}
                onEndReached={() => {
                  onEndReachedUser();
                }}
                ListFooterComponent={searchUserData?.page < searchUserData?.lastPage ? <Spinner /> : <></>}
                keyExtractor={(item, index) => `${index}_${item.id}`}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable
                      onPress={() => {
                        navigation.navigate('OthersProfile', {
                          screen: 'OthersProfile',
                          params: { userId: item.id },
                        });
                      }}
                      style={{
                        height: 60,
                        width: '100%',
                        alignItems: 'center',
                        paddingLeft: 20,
                        flexDirection: 'row',
                      }}>
                      {/*<Image source={{uri:item.avatar}} style={{width:40, height:40, borderRadius:20 , backgroundColor:COLOR.LIGHT_GRAY}} resizeMode={'cover'}/>*/}
                      <ProfileImage
                        source={item.avatar}
                        onPress={() => {
                          navigation.navigate('OthersProfile', {
                            screen: 'OthersProfile',
                            params: { userId: item.id },
                          });
                        }}
                        size={40}
                        key={item.id}></ProfileImage>
                      <Spacer width={10} />
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>검색결과가 없습니다.</Text>
            </View>
          ))}
        <CategoryModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      </View>
    </WhiteSafeArea>
  );
};

export const CategoryModal = ({ isVisible, setIsVisible }: any) => {
  const [showOuter, setShowOuter] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [showSkirt, setShowSkirt] = useState(false);
  const [showBag, setShowBag] = useState(false);
  const [showEtc, setShowEtc] = useState(false);
  const [showShoes, setShowShoes] = useState(false);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      style={{
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        backgroundColor: 'transparent',
      }}>
      <View style={{ height: 500, width: '90%', backgroundColor: 'white', borderRadius: 10 }}>
        <View
          style={{
            height: 60,
            borderBottomColor: COLOR.BORDER_GREY,
            borderBottomWidth: 1.8,
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => setIsVisible(false)}
            style={{ width: 15, height: 15, position: 'absolute', left: 20 }}>
            <Image
              source={require('../../../assets/close.png')}
              style={{ width: 15, height: 15 }}></Image>
          </Pressable>
          <View style={{ width: '40%', alignItems: 'flex-end', paddingRight: 10 }}>
            <Text style={[tw`text-black`, { fontSize: 20, fontWeight: 'bold' }]}>데일리룩</Text>
          </View>
          <View style={{ width: '40%', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLOR.PRIMARY }}>상품</Text>
          </View>
        </View>
        <ScrollView>
          <CategoryContainer
            category={'아우터'}
            isShow={showOuter}
            setShow={setShowOuter}
          />
          <CategoryContainer
            category={'상의'}
            isShow={showTop}
            setShow={setShowTop}
          />
          <CategoryContainer
            category={'바지'}
            isShow={showBottom}
            setShow={setShowBottom}
          />
          <CategoryContainer
            category={'치마'}
            isShow={showSkirt}
            setShow={setShowSkirt}
          />
          <CategoryContainer
            category={'가방'}
            isShow={showBag}
            setShow={setShowBag}
          />
          <CategoryContainer
            category={'잡화'}
            isShow={showEtc}
            setShow={setShowEtc}
          />
          <CategoryContainer
            category={'신발'}
            isShow={showShoes}
            setShow={setShowShoes}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export const CategoryContainer = ({ category, isShow, setShow }: any) => {
  return (
    <>
      <Pressable
        onPress={() => {
          setShow(!isShow);
        }}
        style={{
          paddingLeft: 30,
          paddingRight: 20,
          flexDirection: 'row',
          height: 55,
          alignItems: 'center',
          borderBottomColor: COLOR.BORDER_GREY,
          borderBottomWidth: 1.8,
          justifyContent: 'space-between',
        }}>
        <Text style={[tw`text-black`, { fontSize: 16, fontWeight: '500' }]}>{category}</Text>
        <Image
          source={require('../../../assets/down_ic.png')}
          style={{ width: 15, height: 15 }}
          resizeMode={'contain'}
        />
      </Pressable>
      {isShow && (
        <View style={{ paddingHorizontal: 30, borderBottomColor: COLOR.BORDER_GREY, borderBottomWidth: 1.8 }}>
          {category === '아우터' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>코트</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>점퍼</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>패딩/파카</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>가디건</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>재킷</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>조끼/베스트</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>기타</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}></Text>
                </View>
              </View>
            </>
          )}
          {category === '상의' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>후드티</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>티셔츠</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>니트/스웨터</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>셔츠</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>맨투맨</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>슬리브리스</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>기타</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}></Text>
                </View>
              </View>
            </>
          )}
          {category === '바지' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>코튼팬츠</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>데님</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>점프수트</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>슬랙스</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>스웻/조거팬츠</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>숏</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>기타</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}></Text>
                </View>
              </View>
            </>
          )}
          {category === '치마' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>미니스커트</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>미디스커트</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>롱스커트</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>원피스</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>기타</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}></Text>
                </View>
              </View>
            </>
          )}
          {category === '가방' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>숄더백</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>크로스백</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>토트백</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>백팩</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>클러치</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>기타</Text>
                </View>
              </View>
            </>
          )}
          {category === '잡화' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>모자</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>아이웨어</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>머플러/스카프</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>기타</Text>
                </View>
              </View>
            </>
          )}
          {category === '신발' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>스니커즈</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>부츠</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>로퍼</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>플랫슈즈</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>힐</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>샌들</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>슬리퍼/뮬</Text>
                </View>
                <View style={{ width: '50%', height: 45, justifyContent: 'center' }}>
                  <Text style={{ color: 'rgb(125,127,129)' }}>기타</Text>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </>
  );
};

export default SearchResultPage;
