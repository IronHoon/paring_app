import { NavHead, WhiteSafeArea } from '../../components/layouts';
import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';
import { Dimensions, Image, ScrollView, Text, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { Button } from '../../atoms/button';
import SwrContainer from '../../components/layouts/SwrContainer';
import FastImage from 'react-native-fast-image';
import { Checkbox } from '../../atoms/form';
import { Spacer } from '../../atoms/layout';
import { useMemo, useState } from 'react';
import Postcode from '@actbase/react-daum-postcode';
import Modal from 'react-native-modal';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const formatter = new Intl.NumberFormat('ko-KR');

export function UsedOrderForm({ route }: any) {
  const id = route.params.id;
  const navigation = useNavigation();
  const { data, error } = useFetch<any>(`${API_HOST}/v1/merchandises/${id}`);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const verified = useMemo(() => {
    return name && contact && zipCode && address && addressDetail && isAgreed;
  }, [name, contact, zipCode, address, addressDetail, isAgreed]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <WhiteSafeArea>
      <NavHead
        title={'주문하기'}
        right={undefined}
        children={undefined}
        onLeftPress={undefined}
        left={undefined}
      />
      <ScrollView style={tw`flex-1`}>
        <View style={tw`border-b-8 border-gray-300`} />
        <View style={tw`p-4`}>
          <Text style={tw`text-black font-bold`}>배송 정보</Text>
          <Spacer height={8} />
          <TextInput
            placeholder='이름'
            style={tw`border border-gray-300 rounded-lg py-1 px-3`}
            value={name}
            onChangeText={setName}
          />
          <Spacer height={8} />
          <TextInput
            placeholder='연락처'
            style={tw`border border-gray-300 rounded-lg py-1 px-3`}
            value={contact}
            onChangeText={setContact}
          />
          <Spacer height={12} />
          <Text style={tw`text-black font-bold`}>배송지</Text>
          <Spacer height={8} />
          <View style={tw`flex-row`}>
            <TextInput
              placeholder='주소 찾기를 해주세요'
              style={tw`flex-1 border border-gray-300 rounded-lg py-0 px-3 mr-2`}
              value={address}
              onPressIn={() => setIsPostcodeOpen(true)}
            />
            <Button
              bold={undefined}
              disabled={undefined}
              fontColor={undefined}
              fontSize={undefined}
              full={undefined}
              iconComponent={undefined}
              onPress={() => setIsPostcodeOpen(true)}>
              주소찾기
            </Button>
          </View>
          <Spacer height={8} />
          <TextInput
            placeholder='상세 주소 입력'
            style={tw`border border-gray-300 rounded-lg py-1 px-3`}
            value={addressDetail}
            onChangeText={setAddressDetail}
          />
        </View>
        <View style={tw`border-b-8 border-gray-300`} />
        <SwrContainer
          data={data}
          error={error}>
          {data && (
            <>
              <View style={tw`p-4`}>
                <Text style={tw`text-black font-bold`}>주문 상품 내역</Text>
                <Spacer height={8} />
                <View style={tw`flex-row`}>
                  <FastImage
                    source={{ uri: data.images.split(',').shift() }}
                    style={tw`w-14 h-14 mr-2`}
                  />
                  <View style={tw`justify-center`}>
                    <Text style={tw`text-black font-bold text-xs`}>{data.brand}</Text>
                    <Text style={tw`text-gray-500 text-xs`}>{data.name}</Text>
                    <Text style={tw`text-black font-bold text-xs`}>{formatter.format(data.price)}원</Text>
                  </View>
                </View>
              </View>
              <View style={tw`border-b-8 border-gray-300`} />
              <View style={tw`p-4`}>
                <Text style={tw`font-bold text-black`}>결제 정보</Text>
                <Spacer height={8} />
                <View
                  style={[
                    tw`flex-row justify-between items-center border rounded-lg p-2`,
                    { borderColor: 'rgb(0, 175, 240)' },
                  ]}>
                  <Text style={[tw`text-xs`, { color: 'rgb(0, 175, 240)' }]}>무통장 입금</Text>
                  <Image
                    source={require('../../../assets/ibk.png')}
                    style={{ width: 66, height: 14 }}
                  />
                </View>
                <Spacer height={8} />
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-gray-500 text-xs`}>계좌번호</Text>
                  <Text style={tw`text-black font-bold text-xs`}>390-078426-04-013</Text>
                </View>
                <Spacer height={8} />
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-gray-500 text-xs`}>예금주</Text>
                  <Text style={tw`text-black font-bold text-xs`}>주식회사 페어링</Text>
                </View>
                <Spacer height={8} />
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-gray-500 text-xs`}>입금자명</Text>
                  <Text style={tw`text-black font-bold text-xs`}>{name}</Text>
                </View>
              </View>
              <View style={tw`border-b-8 border-gray-300`} />
              <View style={tw`p-4`}>
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-xs font-bold`}>상품금액</Text>
                  <Text style={tw`text-xs font-bold text-black`}>{formatter.format(data.price)}원</Text>
                </View>
                <Spacer height={8} />
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-xs font-bold`}>페어링 안전거래 수수료</Text>
                  <Text style={tw`text-xs font-bold text-black`}>
                    {formatter.format(Math.floor(data.price * 0.1))}원
                  </Text>
                </View>
                <Spacer height={12} />
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-xs font-bold`}>배송비</Text>
                  <Text style={tw`text-xs font-bold text-black`}>{formatter.format(data.delivery_fee)}원</Text>
                </View>
                <Spacer height={8} />
                <View style={tw`border-b border-gray-300`} />
                <Spacer height={8} />
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-xs font-bold text-black`}>총 결제금액</Text>
                  <Text style={[tw`text-xs font-bold`, { color: 'rgb(0, 175, 240)' }]}>
                    {formatter.format(parseInt(data.price + data.price * 0.1 + data.delivery_fee))}원
                  </Text>
                </View>
              </View>
              <View style={tw`border-b-8 border-gray-300`} />
              <View style={tw`p-4 pb-8 flex-row items-center`}>
                <View style={tw`mr-3`}>
                  <Checkbox
                    disabled={false}
                    checked={isAgreed}
                    setChecked={setIsAgreed}
                  />
                </View>
                <Text style={tw`text-xs font-bold`}>
                  {`주문하시는 상품 및 결제, 주문정보를 확인하였으며, 동의합니다`}
                </Text>
              </View>
              <Button
                bold={undefined}
                disabled={!verified}
                fontColor={undefined}
                fontSize={undefined}
                full={undefined}
                iconComponent={undefined}
                onPress={async () => {
                  try {
                    setIsSubmitting(true);
                    await axios.post(`${API_HOST}/v1/used-orders`, {
                      merchandise_id: data.id,
                      owner_id: data.user_id,
                      name,
                      contact,
                      zipcode: zipCode,
                      address,
                      address_detail: addressDetail,
                      depositor_name: name,
                      price: data.price,
                      fees: Math.floor(data.price * 0.1),
                      shipping_costs: data.delivery_fee,
                    });
                    navigation.navigate('UsedOrderList');
                  } catch (error) {
                    console.warn(error);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}>
                {isSubmitting ? '주문 중...' : '안전거래로 주문하기'}
              </Button>
            </>
          )}
        </SwrContainer>
      </ScrollView>
      <Modal
        style={{ flex: 1 }}
        isVisible={isPostcodeOpen}
        onBackdropPress={() => setIsPostcodeOpen(false)}>
        <Postcode
          style={{ height: Dimensions.get('window').height - 300, width: '100%', zIndex: 999 }}
          jsOptions={{ animation: true }}
          onSelected={(data) => {
            setZipCode(data.zonecode.toString());
            setAddress(data.roadAddress);
            setIsPostcodeOpen(false);
          }}
          onError={function (error: unknown): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Modal>
    </WhiteSafeArea>
  );
}
