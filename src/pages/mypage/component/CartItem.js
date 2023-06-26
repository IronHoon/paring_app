import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Pressable, View } from 'react-native';

import { GraySpace, Hr, Row, Spacer } from '../../../atoms/layout';
import { Text } from '../../../atoms/text';
import { Button } from '../../../atoms/button';
import { Checkbox, NumberSpinner } from '../../../atoms/form';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';
import { useFocusEffect } from '@react-navigation/native';

function CartItem({
  cartData,
  item,
  loading,
  handleSelectedItems,
  onPressItem,
  onChangeAmount,
  onPressBuyNow,
  onPressRemove,
  selected = false,
  ...props
}) {
  // const isDeliveryFeeDiscounted = useMemo(() => {
  //   const sameItems = _.filter(cartData, x => x.id === item.id);
  //   let res = false;
  //   if (sameItems.length > 1) {
  //     res = sameItems.some((x, i) => {
  //       return i > 0 && (x.size_id === item.size_id)
  //     })
  //   }
  //   return res;
  // },[cartData])

  useFocusEffect(
    useCallback(() => {
      if (!item.is_active) {
        handleSelectedItems(false);
      }
    }, [item]),
  );

  return (
    <>
      <ItemComponent>
        <Row style={{ paddingLeft: 8, paddingRight: 13 }}>
          <Checkbox
            disabled={!item.is_active}
            checked={selected}
            setChecked={handleSelectedItems}
          />
        </Row>
        <ItemInner>
          <Top>
            <PressableOndemandImage
              width={86}
              height={86}
              borderRadius={12}
              imgSrc={item.product_data?.thumbnail}
              handlePressItem={() => onPressItem(item.id)}
            />
            <TopTextArea>
              <Pressable onPress={onPressItem}>
                <Text
                  numberOfLines={2}
                  style={{ height: 44 }}>
                  {item.product_data?.product_name}
                </Text>
              </Pressable>
              <Spacer height={14} />
              <Row>
                <GrayText
                  style={{ flex: 1 }}
                  numberOfLines={1}>
                  색상 : {item.product_data?.color_name}
                </GrayText>
                <Spacer width={8} />
                <GrayText
                  style={{ flex: 1 }}
                  numberOfLines={1}>
                  사이즈 : {item.product_data?.size_name}
                </GrayText>
              </Row>
              <Spacer height={20} />
              <Row style={{ alignItems: 'center' }}>
                <GrayText>수량</GrayText>
                <Spacer width={12} />
                <NumberSpinner
                  key={item.id}
                  value={item?.count}
                  setValue={(x) => {
                    onChangeAmount(item, x);
                  }}
                  style={{ width: 108, height: 30, borderRadius: 8 }}
                />
              </Row>
            </TopTextArea>
          </Top>
          <Hr />
          <View style={{ paddingHorizontal: 7 }}>
            <Spacer height={12} />
            <InfoRow>
              <GrayText>상품금액</GrayText>
              <GrayText>
                {item.unit_amount ? new Intl.NumberFormat().format(item.unit_amount * item.count) : 'error'}원
              </GrayText>
            </InfoRow>
            <InfoRow>
              <GrayText>배송금액</GrayText>
              <GrayText>
                {item.origin_delivery_fee ? new Intl.NumberFormat().format(item.origin_delivery_fee) : 'error'}원
              </GrayText>
            </InfoRow>
          </View>
          <Hr />
          <Spacer height={20} />
          <Button
            disabled={loading || !item.is_active}
            onPress={() => onPressBuyNow(item)}>
            {!item.is_active ? '판매 종료' : '바로구매'}
          </Button>
        </ItemInner>
        <Row style={{ paddingLeft: 8, paddingRight: 13 }}>
          <CloseButton
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => onPressRemove(item)}>
            <Text size={14}>X</Text>
          </CloseButton>
        </Row>
      </ItemComponent>
      <GraySpace />
    </>
  );
}

const Top = styled.View`
  flex-direction: row;
  padding-bottom: 13px;
`;

const ItemComponent = styled.View`
  flex-direction: row;
  padding-top: 22px;
  padding-bottom: 15px;
`;

const ItemInner = styled.View`
  flex: 1;
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

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CloseButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  border: 1px solid #000;
  color: #000;
`;

export default CartItem;
