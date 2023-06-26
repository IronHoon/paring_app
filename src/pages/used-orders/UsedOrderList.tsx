import { NavHead, WhiteSafeArea } from '../../components/layouts';
import { ChatListHeader } from '../../components/organisms';
import tw from 'twrnc';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { API_HOST } from '@env';
import { useFetch } from '../../net/core/useFetch';
import SwrContainer from '../../components/layouts/SwrContainer';
import FastImage from 'react-native-fast-image';
import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Spacer } from '../../atoms/layout';
import { Case, Default, Switch, When } from 'react-if';
import axios from 'axios';

const formatter = new Intl.NumberFormat('ko-KR');

export function UsedOrderList() {
  const { data, error, mutate } = useFetch<any>(`${API_HOST}/v1/used-orders`);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      mutate();
    }, []),
  );

  return (
    <WhiteSafeArea>
      <NavHead
        title=''
        right={undefined}
        onLeftPress={undefined}
        left={undefined}>
        <Text style={tw`text-black font-bold text-lg`}>구매 내역</Text>
      </NavHead>
      <ChatListHeader active={'구매내역'} />
      <SwrContainer
        data={data}
        error={error}>
        {data && data.data.length > 0 ? (
          <FlatList
            data={data.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tw`flex-row items-center p-4 border-b border-gray-300`}>
                <View style={tw`mr-2`}>
                  <FastImage
                    source={{ uri: item.merchandise.images.split(',').shift() }}
                    style={tw`w-24 h-24 rounded-lg`}
                  />
                </View>
                <View>
                  <Text style={[tw`text-xs text-black font-bold`]}>{item.merchandise.brand}</Text>
                  <Text style={[tw`text-xs text-black`]}>{item.merchandise.name}</Text>
                  <Text style={[tw`text-xs text-black font-bold`]}>
                    {formatter.format(item.price + item.fees + item.shipping_costs)}원
                  </Text>
                  <When condition={item.status === '주문완료'}>
                    <Text style={[tw`text-xs text-black underline`, { color: 'rgb(0, 176, 243)' }]}>
                      기업은행 390-078426-04-013 (주)페어링
                    </Text>
                  </When>
                  <Spacer height={4} />
                  <Switch>
                    <Case condition={item.status === '주문완료'}>
                      <Text style={[tw`text-xs text-black font-bold`]}>입금준비중</Text>
                    </Case>
                    <Case condition={item.status === '배송중'}>
                      <Text style={[tw`text-xs text-black font-bold`]}>배송중</Text>
                      <Pressable>
                        <Text style={tw`text-xs text-black`}>
                          {item.couriers} {item.shipping_number}
                        </Text>
                      </Pressable>
                    </Case>
                    <Default>
                      <Text style={[tw`text-xs text-black font-bold`]}>{item.status}</Text>
                    </Default>
                  </Switch>
                  <Spacer height={4} />
                  <View style={tw`flex-row`}>
                    <Pressable
                      style={[tw`rounded-full py-0 px-3 mr-1`, { backgroundColor: 'rgb(0, 176, 243)' }]}
                      onPress={async () => {
                        const { data: chatRoom } = await axios.post(`${API_HOST}/v1/chat-rooms`, {
                          to: item.owner_id,
                          merchandise_id: item.merchandise_id,
                        });
                        navigation.navigate('ChatRoom', {
                          id: chatRoom.id,
                        });
                      }}>
                      <Text style={tw`text-white text-xs`}>메세지</Text>
                    </Pressable>
                    <When condition={item.status === '주문완료'}>
                      <Pressable
                        style={[tw`rounded-full py-0 px-3 mr-1`, { backgroundColor: 'rgb(0, 176, 243)' }]}
                        onPress={async () => {
                          Alert.alert('거래 취소', '거래를 취소하시겠습니까?', [
                            {
                              text: '아니오',
                              style: 'cancel',
                            },
                            {
                              text: '거래 취소',
                              onPress: async () => {
                                await axios.patch(`${API_HOST}/v1/used-orders/${item.id}/cancel`);
                                await mutate();
                              },
                            },
                          ]);
                        }}>
                        <Text style={tw`text-white text-xs`}>거래 취소</Text>
                      </Pressable>
                    </When>
                    <When condition={item.status === '배송중'}>
                      <Pressable
                        style={[tw`rounded-full py-0 px-3 mr-1`, { backgroundColor: 'rgb(0, 176, 243)' }]}
                        onPress={async () => {
                          Alert.alert('구매 확정', '구매를 확정하시겠습니까?', [
                            {
                              text: '아니오',
                              style: 'cancel',
                            },
                            {
                              text: '구매 확정',
                              onPress: async () => {
                                try {
                                  await axios.patch(`${API_HOST}/v1/used-orders/${item.id}`, {
                                    status: '구매확정',
                                  });
                                  await mutate();
                                } catch (error: any) {
                                  Alert.alert(error.response?.data?.message ?? '알 수 없는 오류가 발생했습니다.');
                                }
                              },
                            },
                          ]);
                        }}>
                        <Text style={tw`text-white text-xs`}>구매 확정</Text>
                      </Pressable>
                    </When>
                    <When condition={item.status === '배송완료'}>
                      <Pressable
                        style={[tw`rounded-full py-0 px-3 mr-1`, { backgroundColor: 'rgb(0, 176, 243)' }]}
                        onPress={async () => {
                          Alert.alert('구매 확정', '구매를 확정하시겠습니까?', [
                            {
                              text: '아니오',
                              style: 'cancel',
                            },
                            {
                              text: '구매 확정',
                              onPress: async () => {
                                try {
                                  await axios.patch(`${API_HOST}/v1/used-orders/${item.id}`, {
                                    status: '구매확정',
                                  });
                                  await mutate();
                                } catch (error: any) {
                                  Alert.alert(error.response?.data?.message ?? '알 수 없는 오류가 발생했습니다.');
                                }
                              },
                            },
                          ]);
                        }}>
                        <Text style={tw`text-white text-xs`}>구매 확정</Text>
                      </Pressable>
                    </When>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#e4e4e4', fontWeight: '700' }}>구매한 상품이 없어요</Text>
          </View>
        )}
      </SwrContainer>
    </WhiteSafeArea>
  );
}
