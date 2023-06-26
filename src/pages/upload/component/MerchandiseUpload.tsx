import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { Spacer } from '../../../atoms/layout';
import { Text } from '../../../atoms/text';
import tw from 'twrnc';
import { useAtom } from 'jotai';
import { merchandiseItemAtom } from '../../../stores';
import { MerchandiseFormDataType, UploadType } from '../../../types';
import { Else, If, Then, When } from 'react-if';
import { Divider } from './Divider';
import FastImage from 'react-native-fast-image';
import post from '../../../net/core/post';
import { API_HOST, CDN_HOST } from '@env';
import { useNavigation } from '@react-navigation/native';
import patch from '../../../net/core/patch';
// @ts-ignore
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import { upload } from '../../../utils/s3';
import RNFS from 'react-native-fs';
// @ts-ignore
import RNHeicConverter from 'react-native-heic-converter';

const options = {
  includeBase64: true,
  mediaTypes: 'photo',
  title: 'Select Image',
  maxWidth: 2000,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const MerchandiseUpload = (props: any) => {
  const { todo, setUploadType, handleClose } = props;

  const navigation = useNavigation();
  const [price, setPrice] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');

  const [merchandiseItem, setMerchandiseItem] = useAtom(merchandiseItemAtom);

  const canSubmit = useMemo(() => {
    if (!merchandiseItem.images?.length) return false;
    if (merchandiseItem.images?.length > 12) return false;
    // if (!merchandiseItem.brand) return false;
    if (!merchandiseItem.name) return false;
    if (!merchandiseItem.category) return false;
    if (!merchandiseItem.price) return false;
    return true;
  }, [merchandiseItem]);

  const updateMerchandiseItem = useCallback(
    (key: keyof MerchandiseFormDataType, value: any) => {
      setMerchandiseItem({
        ...merchandiseItem,
        [key]: value,
      });
    },
    [merchandiseItem],
  );

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    if (todo === 'create') {
      const params = { ...merchandiseItem };
      // 브랜드가 없을 경우 기본값 NO BRAND 설정
      if (!merchandiseItem.brand) {
        params.brand = 'NO BRAND';
      }
      // 배송비가 없을 경우 기본값 0 설정
      if (!merchandiseItem.delivery_fee) {
        params.delivery_fee = '0';
      }
      await post(`${API_HOST}/v1/merchandises`, params);
      Alert.alert('상품이 등록되었습니다', '게시물에 이 상품을 연결해보세요');
      navigation.navigate('Home');
      setMerchandiseItem({});
    } else if (todo === 'edit') {
      await patch(`${API_HOST}/v1/merchandises/${merchandiseItem.id}`, merchandiseItem);
      Alert.alert('상품이 수정되었습니다');
      navigation.navigate('Home');
      setMerchandiseItem({});
    } else {
      Alert.alert('잘못된 접근입니다');
      return;
    }
  }, [merchandiseItem]);

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {/* 헤더 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pressable
            hitSlop={{ top: 50, left: 50, bottom: 50, right: 50 }}
            onPress={() => {
              handleClose?.();
            }}>
            <Image
              style={{ width: 15, height: 15 }}
              source={require('../../../../assets/close.png')}
            />
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              size={17}
              style={{ color: 'rgb(0,0,0)' }}>
              상품등록
            </Text>
          </View>
          <Pressable
            onPress={async () => {
              await submit();
            }}>
            <Text
              size={17}
              style={{
                color: canSubmit ? 'rgb(0 ,176, 243)' : 'rgb(72,72,72)',
              }}>
              {todo === 'edit' ? '수정' : '등록'}
            </Text>
          </Pressable>
        </View>
        {/* 끝 : 헤더 */}

        <Spacer height={20} />
        {/* 이미지 업로드 영역 */}
        <ScrollView horizontal={true}>
          <Pressable
            style={[
              {
                width: 97,
                height: 97,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'rgb(210,210,210)',
                borderWidth: 1,
                borderRadius: 8,
              },
              tw`mr-2`,
            ]}
            onPress={(e) => {
              // uploadImage(options);
              (async () => {
                const response = await openPicker({
                  mediaType: 'image',
                });
                const results = await Promise.all(
                  response.map((item: any) => {
                    return RNFS.readFile(item.path, 'base64').then(async (res) => {
                      if (item.mime === 'image/heic') {
                        const heic = await RNHeicConverter.convert({
                          // options
                          path: item.path,
                        });
                        const convertResult = await RNFS.readFile(heic.path, 'base64');

                        return upload(
                          convertResult,
                          'image/jpg',
                          item.fileName.replace('.heic', '.jpg').replace('.HEIC', '.jpg'),
                        );
                      } else {
                        return upload(res, item.mime, item.fileName);
                      }
                    });
                  }),
                );

                setMerchandiseItem((prev) => ({
                  ...prev,
                  images: [...(prev.images || []), ...results.map((item: any) => `${CDN_HOST}/${item.Key}`)],
                }));
              })();
            }}>
            <Image
              style={[{ width: 29, height: 23 }, tw`mt-2`]}
              source={require('../../../../assets/camera.png')}
            />
            <Text style={tw`mt-2 text-sm`}>{merchandiseItem.images?.length ?? 0}/12</Text>
          </Pressable>
          {merchandiseItem.images?.map((image) => (
            <View key={image}>
              <FastImage
                source={{ uri: image }}
                style={[
                  {
                    width: 97,
                    height: 97,
                  },
                  tw`mr-2`,
                ]}
              />
              <Pressable
                style={tw`absolute right-2 top-0 bg-black w-4 h-4 rounded-full justify-center items-center`}
                onPress={() => {
                  setMerchandiseItem((prev) => ({
                    ...prev,
                    images: prev.images?.filter((item) => item !== image) || [],
                  }));
                }}>
                <Text style={tw`absolute -top-2 text-lg text-white`}>&times;</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        {/* 끝 : 이미지 업로드 영역 */}
        <Spacer height={20} />
        <FormItem>
          <Label>브랜드명</Label>
          <Input
            value={merchandiseItem.brand}
            placeholder={'NO BRAND'}
            onChangeText={(value) => updateMerchandiseItem('brand', value)}
          />
        </FormItem>
        <Spacer height={12} />
        <Divider />
        <Spacer height={12} />
        <FormItem>
          <Label>상품명</Label>
          <Input
            value={merchandiseItem.name}
            onChangeText={(value) => updateMerchandiseItem('name', value)}
          />
        </FormItem>
        <Spacer height={12} />
        <Divider />
        <Spacer height={12} />
        <FormItem>
          <Label>카테고리</Label>
          <Pressable
            style={tw`flex-1 items-end`}
            onPress={() => setUploadType(UploadType.MerchandiseCategory)}>
            <If condition={merchandiseItem.category}>
              <Then>
                <Text>{merchandiseItem.category}</Text>
              </Then>
              <Else>
                <Text>&gt;</Text>
              </Else>
            </If>
          </Pressable>
        </FormItem>
        <Spacer height={12} />
        <Divider />
        <Spacer height={12} />
        <FormItem>
          <Label>판매가격</Label>
          <Input
            keyboardType='numeric'
            value={price}
            onChangeText={(value) => {
              const formatNum = (Number(value.replace(/\D/g, '')) || '').toLocaleString();
              setPrice(formatNum);
              updateMerchandiseItem('price', value.replace(',', ''));
            }}
          />
        </FormItem>
        <Spacer height={12} />
        <Divider />
        <Spacer height={12} />
        <FormItem>
          <Label>배송비</Label>
          <Input
            keyboardType='numeric'
            placeholder={'0원'}
            // value={merchandiseItem.delivery_fee?.toString()}
            value={deliveryFee}
            onChangeText={(value) => {
              const formatNum = (Number(value.replace(/\D/g, '')) || '').toLocaleString();
              setDeliveryFee(formatNum);
              updateMerchandiseItem('delivery_fee', value.replace(',', ''));
            }}
          />
        </FormItem>
        <Spacer height={12} />
        <Divider />
        <Spacer height={12} />
        <FormItem>
          <Label>상품 설명</Label>
          <Pressable
            style={tw`flex-1 items-end`}
            onPress={() => setUploadType(UploadType.MerchandiseDescription)}>
            <Text>&gt;</Text>
          </Pressable>
        </FormItem>
        <If condition={merchandiseItem.size || merchandiseItem.condition || merchandiseItem.description}>
          <Then>
            <Pressable
              style={tw`pt-2`}
              onPress={() => setUploadType(UploadType.MerchandiseDescription)}>
              <When condition={merchandiseItem.size}>
                <Text style={tw`text-xs text-gray-500 underline`}>사이즈 : {merchandiseItem.size}</Text>
              </When>
              <When condition={merchandiseItem.condition}>
                <Text style={tw`text-xs text-gray-500 underline`}>{merchandiseItem.condition}</Text>
              </When>
              <When condition={merchandiseItem.description}>
                <Text style={tw`my-2`}>{merchandiseItem.description}</Text>
              </When>
            </Pressable>
          </Then>
        </If>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
`;

const FormItem = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const Label = styled.Text`
  color: rgb(177, 175, 175);
  font-size: 16px;
  margin-right: 8px;
`;

const Input = styled.TextInput`
  text-align: right;
  flex: 1;
  padding: 0;
  color: #000000;
`;

export default MerchandiseUpload;
