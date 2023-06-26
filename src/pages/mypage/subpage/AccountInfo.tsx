import { NavHead, WhiteSafeArea } from '../../../components/layouts';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { Spacer } from '../../../atoms/layout';
import COLOR from '../../../../constants/COLOR';
import { Select } from '../../../atoms/form';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import getMyInfo from '../../../net/user/getMyInfo';
import patch from '../../../net/core/patch';
import { API_HOST } from '@env';

export function AccountInfo() {
  const [accountName, setAccountName] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [data] = await getMyInfo();
        setAccountName(data.account_name);
        setBank(data.bank);
        setAccountNumber(data.account_number);
      })();
    }, []),
  );
  const submit = useCallback(() => {
    (async () => {
      Keyboard.dismiss();
      await patch(`${API_HOST}/v1/me`, {
        account_name: accountName,
        bank,
        account_number: accountNumber,
      });
      navigation.goBack();
    })();
  }, [accountName, bank, accountNumber]);
  return (
    <WhiteSafeArea>
      <NavHead
        title={'정산 계좌번호 등록'}
        right={undefined}
        children={undefined}
        onLeftPress={undefined}
        left={undefined}
      />
      <View style={tw`p-6`}>
        <Text style={tw`text-black`}>예금주</Text>
        <TextInput
          placeholder='예금주 입력'
          style={[tw`border-b p-0`, { borderColor: '#747474' }]}
          value={accountName}
          onChangeText={setAccountName}
        />
        <Spacer height={32} />
        <Text style={tw`text-black`}>은행명</Text>
        <View style={tw`h-12`}>
          <Select
            label={'라벨'}
            items={[
              { label: 'KEB하나은행', value: 'KEB하나은행' },
              { label: 'SC제일은행', value: 'SC제일은행' },
              { label: '국민은행', value: '국민은행' },
              { label: '신한은행', value: '신한은행' },
              { label: '외환은행', value: '외환은행' },
              { label: '우리은행', value: '우리은행' },
              { label: '한국시티은행', value: '한국시티은행' },
              { label: '경남은행', value: '경남은행' },
              { label: '광주은행', value: '광주은행' },
              { label: '대구은행', value: '대구은행' },
              { label: '부산은행', value: '부산은행' },
              { label: '전북은행', value: '전북은행' },
              { label: '제주은행', value: '제주은행' },
              { label: '기업은행', value: '기업은행' },
              { label: '농협', value: '농협' },
              { label: '수협', value: '수협' },
              { label: '한국산업은행', value: '한국산업은행' },
              { label: '한국수출입은행', value: '한국수출입은행' },
              { label: '우체국예금보험', value: '우체국예금보험' },
              { label: '카카오뱅크', value: '카카오뱅크' },
              { label: '토스뱅크', value: '토스뱅크' },
            ]}
            value={bank}
            onValueChange={(value: string) => setBank(value)}
          />
        </View>
        <Spacer height={32} />
        <Text style={tw`text-black`}>계좌번호</Text>
        <TextInput
          placeholder='- 없이 계좌번호 입력'
          style={[tw`border-b p-0`, { borderColor: '#747474' }]}
          value={accountNumber}
          onChangeText={setAccountNumber}
        />
        <Spacer height={36} />

        <View style={tw`items-end`}>
          <Pressable onPress={submit}>
            <Text style={[tw`font-bold`, { color: COLOR.PRIMARY }]}>등록 하기</Text>
          </Pressable>
        </View>
      </View>
    </WhiteSafeArea>
  );
}
