import styled from 'styled-components/native';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Text } from '../../../atoms/text';
import React, { Fragment } from 'react';
import { Divider } from './Divider';
import { Spacer } from '../../../atoms/layout';
import tw from 'twrnc';
import { useSetAtom } from 'jotai';
import { merchandiseItemAtom } from '../../../stores';
import { UploadType } from '../../../types';

type Props = {
  setUploadType: (type: UploadType) => void;
};

const categories = [
  {
    name: '아우터',
    children: [{ name: '코트' }, { name: '점퍼' }, { name: '패딩/파카' }, { name: '가디건' }],
  },
  {
    name: '상의',
    children: [
      { name: '후드티' },
      { name: '티셔츠' },
      { name: '니트/스웨터' },
      { name: '셔츠' },
      { name: '맨투맨' },
      { name: '슬리브리스' },
      { name: '기타' },
    ],
  },
  {
    name: '바지',
    children: [
      { name: '코튼팬츠' },
      { name: '데님' },
      { name: '점프수트' },
      { name: '슬랙스' },
      { name: '스웻/조거팬츠' },
      { name: '숏' },
      { name: '기타' },
    ],
  },
  {
    name: '치마',
    children: [
      { name: '미니스커트' },
      { name: '미디스커트' },
      { name: '롱스커트' },
      { name: '원피스' },
      { name: '기타' },
    ],
  },
  {
    name: '가방',
    children: [
      { name: '숄더백' },
      { name: '크로스백' },
      { name: '토트백' },
      { name: '백백' },
      { name: '클러치' },
      { name: '기타' },
    ],
  },
  {
    name: '잡화',
    children: [{ name: '모자' }, { name: '아이웨어' }, { name: '머플러/스카프' }, { name: '기타' }],
  },
  {
    name: '신발',
    children: [
      { name: '스니커즈' },
      { name: '부츠' },
      { name: '로퍼' },
      { name: '플랫슈즈' },
      { name: '힐' },
      { name: '샌들' },
      { name: '슬리퍼/뮬' },
      { name: '기타' },
    ],
  },
];

export function MerchandiseCategory({ setUploadType }: Props) {
  const setMerchandiseItem = useSetAtom(merchandiseItemAtom);
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
              카테고리
            </Text>
          </View>
          <Pressable onPress={() => {}}>
            <View style={{ width: 23 }} />
          </Pressable>
        </View>
        {/* 끝 : 헤더 */}
        {categories.map((category, index) => (
          <Fragment key={category.name}>
            <Spacer height={12} />
            <Divider />
            <Title style={tw`p-2`}>{category.name}</Title>
            <Divider />
            <View style={tw`flex-wrap flex-row py-2`}>
              {category.children.map((child, index) => (
                <Pressable
                  key={child.name}
                  style={tw`w-1/2 px-2 py-1`}
                  onPress={() => {
                    setMerchandiseItem((prev) => ({
                      ...prev,
                      category: `${category.name} > ${child.name}`,
                    }));
                    setUploadType(UploadType.Merchandise);
                  }}>
                  <Text style={{ color: 'rgb(125, 127, 129)' }}>{child.name}</Text>
                </Pressable>
              ))}
            </View>
          </Fragment>
        ))}
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
  font-size: 14px;
  color: #000;
  font-weight: 600;
`;
