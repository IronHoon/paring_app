import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../components/layouts/SwrContainer';
import { ActivityIndicator, Alert, Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import tw from 'twrnc';
import { ProfileImage } from '../../atoms/image';
import { NavHead, WhiteSafeArea } from '../../components/layouts';
import { useContextQ } from 'context-q';
import { Else, If, Then } from 'react-if';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { navigate } from '../../navigators/RootNavigation';
import { deviceWidth, Spacer } from '../../atoms/layout';
import Carousel from 'react-native-reanimated-carousel';
import post from '../../net/core/post';
import Icon from '../../atoms/image/Icon';
import del from '../../net/core/del';

const formatter = new Intl.NumberFormat('ko-KR');

export function MerchandiseDetail({ route }: any) {
  const id = route?.params?.id;
  const { user } = useContextQ();
  const navigation = useNavigation();
  const [bookmarkList, setBookmarkList] = useState<Array<number>>([]);
  const { data, error } = useFetch<any>(`${API_HOST}/v1/merchandises/${id}}`);
  const { data: postData, error: postError } = useFetch<any>(`${API_HOST}/v1/merchandises/${id}/posts`);

  const {
    data: bookmarkData,
    error: bookmarkError,
    mutate: bookmarkMutate,
  } = useFetch<any>(`${API_HOST}/v1/wish-items`);

  const addBookmark = () => {
    post(`${API_HOST}/v1/wish-items`, {
      merchandiseId: id,
    }).then((result) => {
      bookmarkMutate();
    });
  };

  const removeBookmark = () => {
    del(`${API_HOST}/v1/wish-items/${id}`)
      .then((result) => {
        bookmarkMutate();
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      var tempList: number[] = [];
      bookmarkData?.data.map((item: any) => {
        tempList.push(item.merchandise_id);
      });
      setBookmarkList(tempList);
    }, [bookmarkData, bookmarkMutate]),
  );

  const size = Dimensions.get('window').width;
  const [isJoining, setIsJoining] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setActiveIndex(0);
    }, []),
  );

  return (
    <WhiteSafeArea>
      <NavHead
        title='상품 상세'
        right={undefined}
        children={undefined}
        onLeftPress={undefined}
        left={undefined}
      />
      <SwrContainer
        data={data}
        error={error}>
        <>
          {data && (
            <View style={tw`flex-1`}>
              <ScrollView style={tw`flex-1`}>
                {/*{data.images.split(',').map((image: string) => (*/}
                {/*  <FastImage*/}
                {/*    key={image}*/}
                {/*    source={{ uri: `${image}?w=${size * 2}&h=${size * 2}` }}*/}
                {/*    style={{*/}
                {/*      width: size,*/}
                {/*      height: size,*/}
                {/*    }}*/}
                {/*  />*/}
                {/*))}*/}
                <View>
                  <Carousel
                    loop={false}
                    width={deviceWidth}
                    height={size}
                    data={data.images.split(',')}
                    scrollAnimationDuration={1000}
                    autoPlayInterval={4000}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }: { item: string }) => {
                      return (
                        <>
                          <FastImage
                            source={{ uri: item }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </>
                      );
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      width: '100%',
                      height: 20,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    {data.images.split(',').map((item: string, index: number) => {
                      return (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: activeIndex === index ? 'white' : 'rgb(180,180,180)',
                            marginRight: index === data.images.split(',').length - 1 ? 0 : 20,
                            borderRadius: 10,
                          }}></View>
                      );
                    })}
                  </View>
                </View>

                <View style={[tw`p-4 flex-row items-center`, { justifyContent: 'space-between' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ProfileImage
                      source={data?.user.avatar}
                      size={40}
                      onPress={() =>
                        navigation.navigate('OthersProfile', {
                          screen: 'OthersProfile',
                          params: { userId: data.user_id },
                        })
                      }
                    />
                    <Pressable
                      onPress={() =>
                        navigation.navigate('OthersProfile', {
                          screen: 'OthersProfile',
                          params: { userId: data.user_id },
                        })
                      }>
                      <Text style={tw`ml-2 text-black font-bold`}>{data?.user.name}</Text>
                    </Pressable>
                  </View>
                  {bookmarkList.includes(id) ? (
                    <Icon
                      source={require('../../../assets/fullBookmark.png')}
                      size={20}
                      onPress={() => removeBookmark()}
                      onPressIn={undefined}
                    />
                  ) : (
                    <Icon
                      source={require('../../../assets/bookmark.png')}
                      size={20}
                      onPress={() => addBookmark()}
                      onPressIn={undefined}
                    />
                  )}
                </View>
                <View style={tw`border-b border-gray-300`} />
                <View style={tw`p-4`}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{data?.brand}</Text>
                      <Spacer height={2} />
                      <Text style={{ fontSize: 16, color: 'rgb(88,88,.90)' }}>{data?.name}</Text>
                      <Spacer height={2} />
                      <Text style={[tw`text-gray-400 underline`, { fontSize: 12, color: 'rgb(150,150,150)' }]}>
                        {data?.category}
                      </Text>
                      <Text style={[tw`text-gray-400 underline`, { fontSize: 12, color: 'rgb(150,150,150)' }]}>
                        {data?.condition}
                      </Text>
                      <Text style={[tw`text-gray-400 underline`, { fontSize: 12, color: 'rgb(150,150,150)' }]}>
                        {data?.size}
                      </Text>
                      <Text style={[tw`text-gray-400 underline`, { fontSize: 12, color: 'rgb(150,150,150)' }]}>
                        등록일시 : {data?.created_at}
                      </Text>
                    </View>
                    <View style={{ width: 80, height: 80, borderRadius: 8 }}>
                      {postData?.length > 0 && (
                        <Image
                          source={{ uri: postData[0].image }}
                          style={{ width: 80, height: 80, borderRadius: 8 }}
                        />
                      )}
                    </View>
                  </View>
                  <Text style={[tw`text-xs text-black mt-2`, { fontSize: 14 }]}>{data?.description}</Text>
                </View>
              </ScrollView>
              <View style={tw`px-4 py-2 border-t border-gray-300 flex-row justify-between items-center`}>
                <Text style={tw`text-black font-bold`}>{formatter.format(data?.price)}원</Text>
                <If condition={user?.id !== data?.user.id}>
                  <Then>
                    <View style={tw`flex-row`}>
                      <Pressable
                        style={tw`ml-2 border border-gray-400 rounded-lg bg-gray-100 py-1 px-4`}
                        onPress={async () => {
                          try {
                            setIsJoining(true);
                            const { data: chatRoom } = await axios.post(`${API_HOST}/v1/chat-rooms`, {
                              to: data?.user.id,
                              merchandise_id: id,
                            });
                            navigation.navigate('ChatRoom', {
                              id: chatRoom.id,
                            });
                          } catch (error) {
                            console.warn(error);
                            Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
                          } finally {
                            setIsJoining(false);
                          }
                        }}>
                        <If condition={isJoining}>
                          <Then>
                            <ActivityIndicator color='black' />
                          </Then>
                          <Else>
                            <Text style={tw`text-black`}>채팅하기</Text>
                          </Else>
                        </If>
                      </Pressable>
                      <Pressable
                        style={[tw`ml-2 py-1 px-4 rounded-lg`, { backgroundColor: 'rgb(0, 175, 240)' }]}
                        onPress={() => {
                          navigation.navigate('UsedOrderForm', { id });
                        }}>
                        <Text style={tw`text-white`}>구매하기</Text>
                      </Pressable>
                    </View>
                  </Then>
                  <Else>
                    <View style={tw`flex-row`}>
                      <Pressable
                        style={tw`ml-2 border border-gray-400 rounded-lg bg-gray-100 py-1 px-4`}
                        onPress={() => {
                          navigate('Upload', {
                            screen: 'Upload',
                            params: {
                              merchandise: data,
                              todo: 'edit',
                            },
                          });
                        }}>
                        <Text style={tw`text-black`}>수정하기</Text>
                      </Pressable>
                      <Pressable
                        style={tw`ml-2 border border-gray-400 rounded-lg bg-gray-100 py-1 px-4`}
                        onPress={() => {
                          Alert.alert('삭제하기', '정말 삭제하시겠습니까?', [
                            {
                              text: '취소',
                              style: 'cancel',
                            },
                            {
                              text: '삭제',
                              onPress: async () => {
                                try {
                                  await axios.delete(`${API_HOST}/v1/merchandises/${id}}`);
                                  navigation.goBack();
                                } catch (e: any) {
                                  console.warn(e, e?.response?.data);
                                  Alert.alert('오류', e?.response?.data?.message || '알 수 없는 오류가 발생했습니다.');
                                }
                              },
                            },
                          ]);
                        }}>
                        <Text style={tw`text-black`}>삭제하기</Text>
                      </Pressable>
                    </View>
                  </Else>
                </If>
              </View>
            </View>
          )}
        </>
      </SwrContainer>
    </WhiteSafeArea>
  );
}
