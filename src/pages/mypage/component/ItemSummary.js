import React from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
import { Row, Spacer } from '../../../atoms/layout';
import { Text } from '../../../atoms/text';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';

function ItemSummary({ count, product_data: { color_name, product_name, size_name, thumbnail } }) {
  return (
    <Component>
      <View>
        <PressableOndemandImage
          width={86}
          height={86}
          borderRadius={12}
          imgSrc={thumbnail}
        />
      </View>
      <TopTextArea>
        <Text numberOfLines={1}>상품명 {product_name}</Text>
        <Spacer height={3} />
        <Row>
          <GrayText
            style={{ flex: 1 }}
            numberOfLines={1}>
            색상 : {color_name}
          </GrayText>
          <Spacer width={8} />
          <GrayText
            style={{ flex: 1 }}
            numberOfLines={1}>
            사이즈 : {size_name}
          </GrayText>
        </Row>
        <GrayText>수량 : {count}</GrayText>
      </TopTextArea>
    </Component>
  );
}

const Component = styled.View`
  flex-direction: row;
`;

const TopTextArea = styled.View`
  flex: 1;
  justify-content: center;
  padding-left: 20px;
`;
const GrayText = styled.Text`
  font-size: 14px;
  color: rgba(124, 124, 124, 1);
  letter-spacing: -0.35px;
`;
export default ItemSummary;
