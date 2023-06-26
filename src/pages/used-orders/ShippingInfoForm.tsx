import { NavHead, WhiteSafeArea } from '../../components/layouts';
import tw from 'twrnc';
import { Alert, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../atoms/button';
import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../components/layouts/SwrContainer';
import axios from 'axios';
import { Select } from '../../atoms/form';

export function ShippingInfoForm({ route }: any) {
  const navigation = useNavigation();
  const params = route.params;
  const id = params.id;

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        Alert.alert('잘못된 접근입니다.');
        navigation.goBack();
      }
    }, [id]),
  );

  const { data, error } = useFetch<any>(`${API_HOST}/v1/used-orders/${id}`);
  const [couriers, setCouriers] = useState<string>(data?.couriers);
  const [shippingNumber, setShippingNumber] = useState<string>(data?.shipping_number);

  useEffect(() => {
    if (data) {
      setCouriers(data.couriers);
      setShippingNumber(data.shipping_number);
    }
  }, [data]);

  return (
    <WhiteSafeArea>
      <NavHead
        title={undefined}
        right={undefined}
        onLeftPress={undefined}
        left={undefined}>
        <Text style={tw`text-black font-bold text-lg`}>운송장 입력</Text>
      </NavHead>
      <SwrContainer
        data={data}
        error={error}>
        <View style={tw`p-4`}>
          <View style={tw`border border-gray-300 rounded-lg mb-4 h-12`}>
            <Select
              label={'라벨'}
              items={[
                { label: 'CJ대한통운', value: 'CJ대한통운' },
                { label: '롯데택배', value: '롯데택배' },
                { label: '한진택배', value: '한진택배' },
                { label: '로젠택배', value: '로젠택배' },
                { label: '우체국택배', value: '우체국택배' },
                { label: '(주)엠티인터내셔널', value: '(주)엠티인터내셔널' },
                { label: '1004HOME', value: '1004HOME' },
                { label: '2FAST익스프레스', value: '2FAST익스프레스' },
                { label: 'ACEexpress', value: 'ACEexpress' },
                { label: 'ACI', value: 'ACI' },
                { label: 'ADC항운택배', value: 'ADC항운택배' },
                { label: 'AIRWAY익스프레스', value: 'AIRWAY익스프레스' },
                { label: 'APEX', value: 'APEX' },
                { label: 'ARGO', value: 'ARGO' },
                { label: 'AirboyExpress', value: 'AirboyExpress' },
                {
                  label: 'CJ대한통운(국제택배)',
                  value: 'CJ대한통운(국제택배)',
                },
                { label: 'CU편의점택배', value: 'CU편의점택배' },
                { label: 'CwayExpress', value: 'CwayExpress' },
                { label: 'DHL', value: 'DHL' },
                { label: 'DHL(독일)', value: 'DHL(독일)' },
                { label: 'DHLGlobalMail', value: 'DHLGlobalMail' },
                { label: 'DPD', value: 'DPD' },
                { label: 'ECMSExpress', value: 'ECMSExpress' },
                { label: 'EFS', value: 'EFS' },
                { label: 'EMS', value: 'EMS' },
                { label: 'EZUSA', value: 'EZUSA' },
                { label: 'EuroParcel', value: 'EuroParcel' },
                { label: 'FEDEX', value: 'FEDEX' },
                { label: 'GOP당일택배', value: 'GOP당일택배' },
                { label: 'GOS당일택배', value: 'GOS당일택배' },
                { label: 'GPSLOGIX', value: 'GPSLOGIX' },
                { label: 'GSFresh', value: 'GSFresh' },
                { label: 'GSI익스프레스', value: 'GSI익스프레스' },
                { label: 'GSMNTON', value: 'GSMNTON' },
                { label: 'GSPostbox퀵', value: 'GSPostbox퀵' },
                { label: 'GSPostbox택배', value: 'GSPostbox택배' },
                { label: 'GTS로지스', value: 'GTS로지스' },
                { label: 'HI택배', value: 'HI택배' },
                { label: 'HY', value: 'HY' },
                { label: 'IK물류', value: 'IK물류' },
                { label: 'KGL네트웍스', value: 'KGL네트웍스' },
                { label: 'LG전자배송센터', value: 'LG전자배송센터' },
                { label: 'LTL', value: 'LTL' },
                { label: 'NDEX KOREA', value: 'NDEX KOREA' },
                { label: 'SBGLS', value: 'SBGLS' },
                { label: 'SFexpress', value: 'SFexpress' },
                { label: 'SLX택배', value: 'SLX택배' },
                { label: 'SSG', value: 'SSG' },
                { label: 'TNT', value: 'TNT' },
                { label: 'UFO로지스', value: 'UFO로지스' },
                { label: 'UPS', value: 'UPS' },
                { label: 'USPS', value: 'USPS' },
                { label: 'WIZWA', value: 'WIZWA' },
                { label: 'YJS글로벌', value: 'YJS글로벌' },
                { label: 'YJS글로벌(영국)', value: 'YJS글로벌(영국)' },
                { label: 'YUNDAEXPRESS', value: 'YUNDAEXPRESS' },
                { label: 'i-parcel', value: 'i-parcel' },
                { label: '건영복합물류', value: '건영복합물류' },
                { label: '건영택배', value: '건영택배' },
                { label: '경동택배', value: '경동택배' },
                { label: '경인택배', value: '경인택배' },
                { label: '고려택배', value: '고려택배' },
                { label: '골드스넵스', value: '골드스넵스' },
                { label: '국제익스프레스', value: '국제익스프레스' },
                { label: '굿투럭', value: '굿투럭' },
                { label: '나은물류', value: '나은물류' },
                { label: '노곡물류', value: '노곡물류' },
                { label: '농협택배', value: '농협택배' },
                { label: '농협하나로마트', value: '농협하나로마트' },
                { label: '대림통운', value: '대림통운' },
                { label: '대신택배', value: '대신택배' },
                { label: '대운글로벌', value: '대운글로벌' },
                { label: '더바오', value: '더바오' },
                { label: '도도플렉스', value: '도도플렉스' },
                { label: '동강물류', value: '동강물류' },
                { label: '동진특송', value: '동진특송' },
                { label: '두발히어로당일택배', value: '두발히어로당일택배' },
                { label: '딜리래빗', value: '딜리래빗' },
                { label: '라스트마일', value: '라스트마일' },
                { label: '라인익스프레스', value: '라인익스프레스' },
                { label: '로드썬익스프레스', value: '로드썬익스프레스' },
                { label: '로지스밸리', value: '로지스밸리' },
                { label: '로토스', value: '로토스' },
                {
                  label: '롯데글로벌로지스(국제택배)',
                  value: '롯데글로벌로지스(국제택배)',
                },
                { label: '롯데칠성', value: '롯데칠성' },
                { label: '바바바로지스', value: '바바바로지스' },
                { label: '반품구조대', value: '반품구조대' },
                { label: '발렉스', value: '발렉스' },
                { label: '배송하기좋은날', value: '배송하기좋은날' },
                { label: '범한판토스', value: '범한판토스' },
                { label: '부릉', value: '부릉' },
                { label: '브릿지로지스', value: '브릿지로지스' },
                { label: '삼다수가정배송', value: '삼다수가정배송' },
                { label: '삼성전자물류', value: '삼성전자물류' },
                { label: '성원글로벌', value: '성원글로벌' },
                { label: '성훈물류', value: '성훈물류' },
                { label: '세방택배', value: '세방택배' },
                { label: '스마트로지스', value: '스마트로지스' },
                { label: '스페이시스원', value: '스페이시스원' },
                { label: '시알로지텍', value: '시알로지텍' },
                { label: '애니트랙', value: '애니트랙' },
                { label: '어바웃펫', value: '어바웃펫' },
                { label: '에스더쉬핑', value: '에스더쉬핑' },
                { label: '에이스물류', value: '에이스물류' },
                { label: '에이씨티앤코아', value: '에이씨티앤코아' },
                { label: '에이치케이홀딩스', value: '에이치케이홀딩스' },
                { label: '엔티엘피스', value: '엔티엘피스' },
                { label: '엘로지스', value: '엘로지스' },
                { label: '오늘의픽업', value: '오늘의픽업' },
                { label: '오늘회러쉬', value: '오늘회러쉬' },
                { label: '올타코리아', value: '올타코리아' },
                { label: '용마로지스', value: '용마로지스' },
                { label: '우리동네커머스', value: '우리동네커머스' },
                { label: '우리동네택배', value: '우리동네택배' },
                { label: '우리택배', value: '우리택배' },
                { label: '우리한방택배', value: '우리한방택배' },
                { label: '우진인터로지스', value: '우진인터로지스' },
                { label: '우편등기', value: '우편등기' },
                { label: '웅지익스프레스', value: '웅지익스프레스' },
                { label: '워펙스', value: '워펙스' },
                { label: '위니온로지스', value: '위니온로지스' },
                { label: '위드유당일택배', value: '위드유당일택배' },
                { label: '유프레이트코리아', value: '유프레이트코리아' },
                { label: '은하쉬핑', value: '은하쉬핑' },
                { label: '이투마스', value: '이투마스' },
                { label: '일반우편', value: '일반우편' },
                { label: '일신모닝택배', value: '일신모닝택배' },
                { label: '일양로지스', value: '일양로지스' },
                { label: '자이언트', value: '자이언트' },
                { label: '제니엘시스템', value: '제니엘시스템' },
                { label: '제이로지스트', value: '제이로지스트' },
                { label: '지니고당일특급', value: '지니고당일특급' },
                { label: '지디에이코리아', value: '지디에이코리아' },
                { label: '직구문', value: '직구문' },
                { label: '천일택배', value: '천일택배' },
                { label: '초록마을', value: '초록마을' },
                { label: '캐나다쉬핑', value: '캐나다쉬핑' },
                { label: '케이제이티', value: '케이제이티' },
                { label: '큐런', value: '큐런' },
                { label: '큐브플로우', value: '큐브플로우' },
                { label: '큐익스프레스', value: '큐익스프레스' },
                { label: '탱고앤고', value: '탱고앤고' },
                { label: '투데이', value: '투데이' },
                { label: '팀프레시', value: '팀프레시' },
                { label: '파테크해운상공', value: '파테크해운상공' },
                { label: '파테크해운항공', value: '파테크해운항공' },
                { label: '판월드로지스틱', value: '판월드로지스틱' },
                {
                  label: '팬스타국제특송(PIEX)',
                  value: '팬스타국제특송(PIEX)',
                },
                { label: '퍼레버택배', value: '퍼레버택배' },
                { label: '펫프렌즈', value: '펫프렌즈' },
                { label: '풀무원(로지스밸리)', value: '풀무원(로지스밸리)' },
                { label: '프레딧', value: '프레딧' },
                { label: '프레시메이트', value: '프레시메이트' },
                { label: '프레시솔루션', value: '프레시솔루션' },
                { label: '핑퐁', value: '핑퐁' },
                { label: '하우저', value: '하우저' },
                { label: '하이브시티', value: '하이브시티' },
                { label: '한달음택배', value: '한달음택배' },
                { label: '한덱스', value: '한덱스' },
                { label: '한샘', value: '한샘' },
                { label: '한우리물류', value: '한우리물류' },
                { label: '한의사랑택배', value: '한의사랑택배' },
                { label: '합동택배', value: '합동택배' },
                { label: '허우적', value: '허우적' },
                { label: '현대글로비스', value: '현대글로비스' },
                { label: '홈이노베이션로지스', value: '홈이노베이션로지스' },
                { label: '홈플러스', value: '홈플러스' },
                { label: '홈플러스익스프레스', value: '홈플러스익스프레스' },
                { label: '홈픽오늘도착', value: '홈픽오늘도착' },
                { label: '홈픽택배', value: '홈픽택배' },
                { label: '화물을부탁해', value: '화물을부탁해' },
              ]}
              value={couriers}
              onValueChange={(value: string) => setCouriers(value)}
            />
          </View>
          {/*<TextInput*/}
          {/*  style={tw`border border-gray-300 rounded-lg mb-4 px-4`}*/}
          {/*  placeholder="택배사"*/}
          {/*  value={couriers}*/}
          {/*  onChangeText={text => setCouriers(text)}*/}
          {/*/>*/}
          <TextInput
            style={tw`border border-gray-300 rounded-lg mb-4 px-4`}
            placeholder='송장번호'
            value={shippingNumber}
            onChangeText={(text) => setShippingNumber(text)}
          />
          <Button
            bold={undefined}
            disabled={undefined}
            fontColor={undefined}
            fontSize={undefined}
            full={undefined}
            iconComponent={undefined}
            onPress={() => {
              if (!couriers?.trim()) {
                Alert.alert('택배사를 입력해주세요.');
                return;
              }
              axios
                .patch(`${API_HOST}/v1/used-orders/${id}`, {
                  couriers,
                  shipping_number: shippingNumber,
                  status: '배송중',
                })
                .then(() => {
                  navigation.goBack();
                })
                .catch((error) => {
                  Alert.alert(error.response.data.message || '오류가 발생했습니다.');
                });
            }}>
            <Text>운송장 입력</Text>
          </Button>
        </View>
      </SwrContainer>
    </WhiteSafeArea>
  );
}
