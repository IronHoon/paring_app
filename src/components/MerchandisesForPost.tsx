import { ActivityIndicator, Alert, Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { useFetch } from '../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from './layouts/SwrContainer';
import tw from 'twrnc';
import FastImage from 'react-native-fast-image';
import { Else, If, Then } from 'react-if';
import { useContextQ } from 'context-q';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import COLOR from '../../constants/COLOR';
import { Spacer } from '../atoms/layout';
import { getResizePath } from '../utils';

type Props = {
  id: string | number;
  post: any;
};

const formatter = new Intl.NumberFormat('ko-KR');

export function MerchandisesForPost({ id, post }: Props) {
  const { user } = useContextQ();
  const navigation = useNavigation();
  const { data, error } = useFetch<any>(`${API_HOST}/v1/posts/${id}/merchandises`);

  const { data: allMerchandises, error: allMerchandisesError } = useFetch<any>(
    `${API_HOST}/v1/users/${post.user_id}/merchandises`,
  );
  const [isJoining, setIsJoining] = useState(false);

  return (
    <SwrContainer
      data={data}
      error={error}>
      <>
        <Spacer height={3} />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={[tw`flex-row py-2`, { paddingLeft: 3 }]}>
          {data &&
            data.map((merchandise: any) => (
              <Pressable
                key={merchandise.id}
                style={[
                  tw`border border-gray-300 rounded p-1 mr-2`,
                  {
                    borderColor: 'white',
                    shadowColor: 'black',
                    shadowOffset: { x: 0, y: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    backgroundColor: 'white',
                    width: Dimensions.get('window').width * 0.25,
                    height: Dimensions.get('window').width * 0.37,
                  },
                ]}
                onPress={() => {
                  navigation.navigate('MerchandiseDetailPage', {
                    id: merchandise.id,
                  });
                }}>
                <View
                  style={[
                    tw`absolute z-100`,
                    {
                      bottom: 2,
                      right: 2,
                    },
                  ]}>
                  <Text style={[tw``, { fontSize: 10, color: COLOR.PRIMARY }]}>착장</Text>
                </View>
                <FastImage
                  source={{
                    uri: getResizePath(
                      merchandise.images.split(',')[0],
                      Dimensions.get('window').width * 0.23 * 2,
                      Dimensions.get('window').width * 0.23 * 2,
                    ),
                    priority: FastImage.priority.low,
                  }}
                  style={{
                    width: Dimensions.get('window').width * 0.23,
                    height: Dimensions.get('window').width * 0.23,
                  }}
                />
                <Spacer height={3} />
                <Text
                  style={[tw`text-black font-bold`, { fontSize: 12 }]}
                  numberOfLines={1}
                  ellipsizeMode='tail'>
                  {merchandise.brand}
                </Text>
                <Text
                  style={[tw`text-black`, { fontSize: 10, color: COLOR.GRAY }]}
                  numberOfLines={1}
                  ellipsizeMode='tail'>
                  {merchandise.name}
                </Text>
                <Text style={[tw`text-black font-bold`, { fontSize: 10 }]}>
                  {formatter.format(merchandise.price)}원
                </Text>
              </Pressable>
            ))}
          <SwrContainer
            data={allMerchandises}
            error={allMerchandisesError}>
            <>
              {allMerchandises &&
                allMerchandises.data
                  .filter((m: any) => !data?.find((el: any) => el.id == m.id))
                  .map((merchandise: any) => (
                    <Pressable
                      key={merchandise.id}
                      style={[
                        tw`border border-gray-300 rounded p-1 mr-2`,
                        {
                          borderColor: 'white',
                          shadowColor: 'black',
                          shadowOffset: { x: 0, y: 0 },
                          shadowOpacity: 0.3,
                          shadowRadius: 2,
                          backgroundColor: 'white',
                          width: Dimensions.get('window').width * 0.25,
                          height: Dimensions.get('window').width * 0.37,
                        },
                      ]}
                      onPress={() => {
                        navigation.navigate('MerchandiseDetailPage', {
                          id: merchandise.id,
                        });
                      }}>
                      <FastImage
                        source={{
                          uri: getResizePath(
                            merchandise.images.split(',')[0],
                            Dimensions.get('window').width * 0.23 * 2,
                            Dimensions.get('window').width * 0.23 * 2,
                          ),
                          priority: FastImage.priority.low,
                        }}
                        style={{
                          width: Dimensions.get('window').width * 0.23,
                          height: Dimensions.get('window').width * 0.23,
                        }}
                      />
                      <Spacer height={3} />
                      {/*말줄임표 처리*/}
                      <Text
                        style={[tw`text-black font-bold`, { fontSize: 12 }]}
                        numberOfLines={1}
                        ellipsizeMode='tail'>
                        {merchandise.brand}
                      </Text>
                      <Text
                        style={[tw`text-black`, { fontSize: 10, color: COLOR.GRAY }]}
                        numberOfLines={1}
                        ellipsizeMode='tail'>
                        {merchandise.name}
                      </Text>
                      <Text style={[tw`text-black font-bold`, { fontSize: 10 }]}>
                        {formatter.format(merchandise.price)}원
                      </Text>
                    </Pressable>
                  ))}
            </>
          </SwrContainer>
        </ScrollView>
        {/*본인 게시물일 경우에만 표시*/}
        <If condition={user.id === post.user_id}>
          <Then>
            <View style={tw`flex-row justify-center my-4`}>
              <Pressable
                style={[tw`w-70 h-7 rounded items-center justify-center border mr-4`]}
                onPress={() => {
                  navigation.navigate('SelectMerchandisesPage', {
                    postId: post?.id,
                  });
                }}>
                <Text style={[tw`text-black`]}>내 상품 목록에서 착장 상품 연동하기</Text>
              </Pressable>
            </View>
          </Then>
          <Else>
            <View style={tw`flex-row justify-center my-4`}>
              <Pressable
                onPress={() => navigation.navigate('OthersMerchandises', { userId: post.user_id })}
                style={[tw`w-35 h-7 rounded items-center justify-center border mr-4`]}>
                <Text style={[tw`text-black`]}>다른 상품 보기</Text>
              </Pressable>
              <Pressable
                style={[tw`w-35 h-7 rounded items-center justify-center bg-black`]}
                onPress={async () => {
                  try {
                    setIsJoining(true);
                    const { data: chatRoom } = await axios.post(`${API_HOST}/v1/chat-rooms`, {
                      to: post.user_id,
                      post_id: post.id,
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
                    <ActivityIndicator
                      size='small'
                      color='#fff'
                    />
                  </Then>
                  <Else>
                    <Text style={[tw`text-white`]}>상품 문의하기</Text>
                  </Else>
                </If>
              </Pressable>
            </View>
          </Else>
        </If>
        <View style={tw` border-b border-gray-300`} />
      </>
    </SwrContainer>
  );
}
