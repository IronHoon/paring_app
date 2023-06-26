import { NavHead, WhiteSafeArea } from '../../components/layouts';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import tw from 'twrnc';
import { API_HOST } from '@env';
import { useFetch } from '../../net/core/useFetch';
import SwrContainer from '../../components/layouts/SwrContainer';
import { MerchandiseListType } from '../../types';
import FastImage from 'react-native-fast-image';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import get from '../../net/core/get';
import { Else, If, Then, When } from 'react-if';
import patch from '../../net/core/patch';
import COLOR from '../../../constants/COLOR';

const formatter = new Intl.NumberFormat('ko-KR');

// @ts-ignore
export function SelectMerchandisePage({ route }) {
  const postId = route?.params?.postId;
  const navigation = useNavigation();
  const { data, error, mutate } = useFetch<MerchandiseListType>(`${API_HOST}/v1/merchandises`);
  const [selected, setSelected] = useState<any[]>([]);
  // const {
  //   data: selectedData = [],
  //   error: selectedError,
  //   mutate,
  // } = useFetch<any[]>(`${API_HOST}/v1/posts/${postId}/merchandises`);

  useFocusEffect(
    useCallback(() => {
      if (!postId) {
        Alert.alert('게시물을 찾을 수 없습니다.');
        navigation.goBack();
      }
    }, [postId]),
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (postId) {
          try {
            await mutate();
            const [selected] = await get(`${API_HOST}/v1/posts/${postId}/merchandises`);
            setSelected(() => selected.map((item: any) => item.id));
          } catch {}
        }
      })();
    }, []),
  );

  return (
    <WhiteSafeArea>
      <NavHead
        select={true}
        title='착장 상품 선택'
        right={
          <Pressable
            onPress={() => {
              (async () => {
                try {
                  await patch(`${API_HOST}/v1/posts/${postId}/merchandises`, {
                    merchandise_ids: selected,
                  });
                  Alert.alert('저장되었습니다.');
                  navigation.goBack();
                } catch (error) {
                  console.warn(error);
                  Alert.alert('저장에 실패했습니다.');
                }
              })();
            }}>
            <Text>완료</Text>
          </Pressable>
        }
        children={undefined}
        onLeftPress={undefined}
        left={undefined}
      />
      <Text style={tw`text-black text-center `}>이 게시물에서 실제로 착용한 상품을 선택해주세요.</Text>

      {/*질문 답변 영역*/}
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Image
          source={require('../../../assets/description.png')}
          style={{ width: '90%', height: 80 }}
          resizeMode={'contain'}></Image>
      </View>
      {/*<View*/}
      {/*  style={tw`flex-row items-center border border-gray-700 rounded-xl m-4`}>*/}
      {/*  <View style={tw`flex-2 mx-2`}>*/}
      {/*    <Text style={[tw`text-black font-bold`, { fontSize: 10 }]}>*/}
      {/*      Q. 착장 상품으로 등록하면?*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*  <View style={tw`flex-3 mr-2 py-2`}>*/}
      {/*    <Text style={[tw`text-black`, { fontSize: 10 }]}>*/}
      {/*      1. 이 게시물의{' '}*/}
      {/*      <Text style={[{ color: 'rgb(0, 176, 243)' }]}>*/}
      {/*        가장 앞에 고정되어 더 쉽게 판매할 수 있어요.*/}
      {/*      </Text>*/}
      {/*    </Text>*/}
      {/*    <Text style={[tw`text-black`, { fontSize: 10 }]}>*/}
      {/*      2. 상품 검색을 했을 때{' '}*/}
      {/*      <Text style={[{ color: 'rgb(0, 176, 243)' }]}>*/}
      {/*        우선적으로 검색되며, 상단에 노출돼요.*/}
      {/*      </Text>*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*</View>*/}
      {/*끝 : 질문 답변 영역*/}

      <SwrContainer
        data={data}
        error={error}>
        <ScrollView style={tw`flex-1`}>
          <View style={{ width: '100%', height: 13, backgroundColor: COLOR.BORDER_GREY }}></View>

          <View style={tw`flex-row flex-wrap p-1`}>
            {data?.data.map((item) => (
              <View
                key={item.id}
                style={[
                  tw`w-1/3 p-1`,
                  { borderBottomWidth: 1, borderBottomColor: COLOR.BORDER_GREY, marginBottom: 3 },
                ]}>
                <FastImage
                  source={{ uri: item.images?.split(',').shift() }}
                  style={tw`w-full h-32`}
                />
                <View style={{ justifyContent: 'center', flex: 1, paddingTop: 3, paddingBottom: 3 }}>
                  <Text style={tw`text-black font-bold`}>{item.brand}</Text>
                  <Text style={{ color: COLOR.GRAY, fontSize: 12 }}>{item.name}</Text>
                  <Text style={tw`text-black font-bold`}>{formatter.format(item.price)}원</Text>
                </View>

                <Pressable
                  style={{ position: 'absolute', right: 5, top: 5 }}
                  onPress={() => {
                    if (selected.includes(item.id)) {
                      setSelected(selected.filter((id) => id !== item.id));
                    } else {
                      setSelected([...selected, item.id]);
                    }
                  }}>
                  <When condition={selected.includes(item.id)}></When>
                  <If condition={selected.includes(item.id)}>
                    <Then>
                      <Image
                        source={require('../../../assets/checked.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    </Then>
                    <Else>
                      <View style={tw`w-5 h-5 border bg-white`} />
                    </Else>
                  </If>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </SwrContainer>
    </WhiteSafeArea>
  );
}
