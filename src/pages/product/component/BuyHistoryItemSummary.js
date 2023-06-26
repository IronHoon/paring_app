import React from 'react';
import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';

import { Row, Spacer } from '../../../atoms/layout';
import { Text } from '../../../atoms/text';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';
import FastImage from 'react-native-fast-image';

function BuyHistoryItemSummary({
  amounts,
  count,
  color,
  courier,
  courier_number,
  product_id,
  size,
  status,
  subject,
  thumbnail,
  options,
}) {
  const { navigate } = useNavigation();
  const onPressItem = () => {
    navigate('ProductDetail', {
      screen: 'ProductDetail',
      params: {
        product_id,
      },
    });
  };
  return (
    <Component>
      <PressableOndemandImage
        width={86}
        height={86}
        borderRadius={12}
        resizeMode={FastImage.resizeMode.cover}
        imgSrc={thumbnail}
        handlePressItem={onPressItem}
      />
      <TextArea onPress={onPressItem}>
        <Text numberOfLines={1}>상품명 {subject}</Text>
        <Spacer height={3} />
        <Row>
          <GrayText
            style={{ flex: 1 }}
            numberOfLines={1}>
            색상 : {color?.name}
          </GrayText>
          <Spacer width={8} />
          <GrayText
            style={{ flex: 1 }}
            numberOfLines={1}>
            사이즈 : {size?.name}
          </GrayText>
        </Row>
        <GrayText>수량 : {count}</GrayText>
        <GrayText>출고상태 {status || '주문 확인중'}</GrayText>
        <GrayText>(송장번호 {!!courier && !!courier_number ? `${courier} ${courier_number}` : '없음'})</GrayText>
      </TextArea>
    </Component>
  );
}

const Component = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const TextArea = styled.Pressable`
  flex: 1;
  justify-content: center;
  padding-left: 20px;
`;
const GrayText = styled.Text`
  font-size: 12px;
  color: #7c7c7c;
  letter-spacing: -0.35px;
`;
export default BuyHistoryItemSummary;
