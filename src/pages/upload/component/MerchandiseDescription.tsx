import styled from 'styled-components/native';
import { Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Text } from '../../../atoms/text';
import React, { useEffect } from 'react';
import { Divider } from './Divider';
import { Spacer } from '../../../atoms/layout';
import tw from 'twrnc';
import { useAtom } from 'jotai';
import { merchandiseItemAtom } from '../../../stores';
import { UploadType } from '../../../types';
import COLOR from '../../../../constants/COLOR';

type Props = {
  setUploadType: (type: UploadType) => void;
};

export function MerchandiseDescription({ setUploadType }: Props) {
  const [merchandiseItem, setMerchandiseItem] = useAtom(merchandiseItemAtom);

  useEffect(() => {
    if (!merchandiseItem.condition) {
      setMerchandiseItem({ ...merchandiseItem, condition: '새 상품이에요' });
    }
  }, []);

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
            onPress={() => setUploadType(UploadType.Merchandise)}>
            <Image
              style={{ width: 23, height: 15 }}
              source={require('../../../../assets/back.png')}
            />
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              size={17}
              style={{ color: 'rgb(0,0,0)' }}>
              상품설명
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setUploadType(UploadType.Merchandise);
            }}>
            <View style={{ width: 30 }}>
              <Text style={{ color: COLOR.PRIMARY }}>완료</Text>
            </View>
          </Pressable>
        </View>
        {/* 끝 : 헤더 */}

        <Spacer height={12} />
        <Divider />
        <Spacer height={12} />
        <Title>사이즈</Title>
        <Spacer height={6} />
        <View style={{ paddingVertical: 10 }}>
          <TextInput
            style={[tw`w-full`, { fontSize: 14, padding: 0 }]}
            placeholder='상품의 사이즈를 입력해주세요 (선택)'
            value={merchandiseItem.size}
            onChangeText={(text) => setMerchandiseItem((prev) => ({ ...prev, size: text }))}
          />
        </View>

        <Divider />
        <Spacer height={20} />
        <Title>컨디션</Title>
        <Spacer height={20} />
        <View style={tw`flex-row`}>
          <Button
            active={merchandiseItem.condition === '새 상품이에요'}
            onPress={() =>
              setMerchandiseItem((prev) => ({
                ...prev,
                condition: '새 상품이에요',
              }))
            }>
            <ButtonLabel active={merchandiseItem.condition === '새 상품이에요'}>새 상품이에요</ButtonLabel>
          </Button>
          <Spacer width={24} />
          <Button
            active={merchandiseItem.condition === '거의 새상품이에요'}
            onPress={() =>
              setMerchandiseItem((prev) => ({
                ...prev,
                condition: '거의 새상품이에요',
              }))
            }>
            <ButtonLabel active={merchandiseItem.condition === '거의 새상품이에요'}>거의 새상품이에요</ButtonLabel>
          </Button>
        </View>
        <Spacer height={10} />
        <View style={tw`flex-row`}>
          <Button
            active={merchandiseItem.condition === '약간의 사용감 있어요'}
            onPress={() =>
              setMerchandiseItem((prev) => ({
                ...prev,
                condition: '약간의 사용감 있어요',
              }))
            }>
            <ButtonLabel active={merchandiseItem.condition === '약간의 사용감 있어요'}>
              약간의 사용감 있어요
            </ButtonLabel>
          </Button>
          <Spacer width={24} />
          <Button
            active={merchandiseItem.condition === '사용 흔적이 많아요'}
            onPress={() =>
              setMerchandiseItem((prev) => ({
                ...prev,
                condition: '사용 흔적이 많아요',
              }))
            }>
            <ButtonLabel active={merchandiseItem.condition === '사용 흔적이 많아요'}>사용 흔적이 많아요</ButtonLabel>
          </Button>
        </View>
        <Spacer height={25} />
        <Divider />
        <Spacer height={20} />
        <Title>상세설명</Title>
        <Spacer height={20} />
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-4`}
          multiline={true}
          numberOfLines={10}
          textAlignVertical={'top'}
          placeholder={`구매자가 알아야 할 정보를 입력해주세요!\n-사이즈, 컬러, 브랜드 등\n-사용감(보풀, 스크래치, 터치감 등)과 사용기간 (구입시기 등)\n얼룩, 오염 등의 하자 정보도 꼭 기재해주세요.`}
          value={merchandiseItem.description}
          onChangeText={(text) => setMerchandiseItem((prev) => ({ ...prev, description: text }))}
        />
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 16px;
  color: #000;
  font-weight: 600;
`;

type ButtonProps = {
  active: boolean;
};

const Button = styled.Pressable<ButtonProps>`
  background: ${(props) => (props.active ? 'rgb(0, 175, 240)' : 'rgb(255, 255, 255)')};
  padding: 12px;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: ${(props) => (props.active ? 'none' : '2px solid rgb(214, 214, 214)')};
`;

const ButtonLabel = styled.Text<ButtonProps>`
  color: ${(props) => (props.active ? 'rgb(255,255,255)' : 'rgb(141, 141, 142)')};
`;
