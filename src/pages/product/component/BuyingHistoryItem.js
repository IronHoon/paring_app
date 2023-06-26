import styled from 'styled-components';
import React from 'react';

import COLOR from '../../../../constants/COLOR';
import { GraySpace, SpaceBetweenRow, Spacer } from '../../../atoms/layout';
import { Bold, Text } from '../../../atoms/text';
import BuyHistoryItemSummary from './BuyHistoryItemSummary';

const formatNumber = (n) => {
  return new Intl.NumberFormat().format(n || 0);
};
function BuyingHistoryItem({ item }) {
  const { items } = item;

  return (
    <>
      <GraySpace />
      <ItemComponent>
        <ItemInner>
          {items?.map((x, i) => (
            <BuyHistoryItemSummary
              key={`${x.id}`}
              {...x}
            />
          ))}
          <Spacer height={12} />
          <SpaceBetweenRow style={{ paddingHorizontal: 7 }}>
            <Text size={14}>총 상품</Text>
            <Text
              size={14}
              style={{ color: '#7c7c7c', flex: 1, textAlign: 'right' }}>
              {formatNumber(item.amounts || 0)}원
            </Text>
          </SpaceBetweenRow>
          <SpaceBetweenRow style={{ paddingHorizontal: 7 }}>
            <Text size={14}>총 배송금액</Text>
            <Text
              size={14}
              style={{ color: '#7c7c7c', flex: 1, textAlign: 'right' }}>
              {formatNumber(item.delivery_fee || 0)}원
            </Text>
          </SpaceBetweenRow>
          <SpaceBetweenRow style={{ paddingHorizontal: 7 }}>
            <Bold size={14}>총 결제금액</Bold>
            <Bold
              size={14}
              style={{ color: COLOR.PRIMARY, flex: 1, textAlign: 'right' }}>
              {formatNumber(item.amounts + item.delivery_fee)}원
            </Bold>
          </SpaceBetweenRow>
        </ItemInner>
      </ItemComponent>
    </>
  );
}

const ItemComponent = styled.View``;

const ItemInner = styled.View`
  padding-horizontal: 34px;
  padding-top: 22px;
  padding-bottom: 15px;
`;

export default BuyingHistoryItem;
