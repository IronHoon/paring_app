import React, { useRef } from 'react';
import { FlatList } from 'react-native';

import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';
import styled from 'styled-components';
import { deviceWidth } from '../../../atoms/layout/DeviceWidth';

const ProductItemContainer = styled.View`
  padding: 6px 6px 10px;
`;
const Name = styled.Text`
  font-size: 14px;
  margin-top: 6px;
  color: #222;
`;
const Price = styled.Text`
  font-size: 14px;
  color: #222;
  font-weight: bold;
  letter-spacing: -0.5px;
`;
const Container = styled.View`
  flex: 1;
  padding: 0 10px;
`;

const ProductItemList = ({
  dataset = [],
  from,
  refreshing = false,
  handleRefresh = null,
  useFlatlist = false,
  ListFooterComponent,
  ListHeaderComponent,
  handlePressItem = () => {},
  onEndReached = () => {},
  ...props
}) => {
  const onEndReachedCalledDuringMomentum = useRef();

  return (
    <Container>
      {dataset.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}_${item.id}`}
          data={dataset}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductItem
              data={item}
              onPress={handlePressItem}
            />
          )}
          ListFooterComponent={ListFooterComponent}
          ListHeaderComponent={ListHeaderComponent}
          initialNumToRender={18}
          windowSize={24}
          disableVirtualization={false}
          removeClippedSubviews={true} // bug exist
          legacyImplementation={true}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReachedThreshold={0.25}
          onEndReached={(e) => {
            if (!onEndReachedCalledDuringMomentum.current) {
              onEndReached(e); // LOAD MORE DATA
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </Container>
  );
};

const ProductItem = ({ data, onPress }) => {
  return (
    <ProductItemContainer>
      <PressableOndemandImage
        borderRadius={8}
        width={(deviceWidth - 44) / 2}
        height={(deviceWidth - 44) / 2}
        handlePressItem={() => {
          onPress?.(data);
        }}
        imgSrc={data?.thumbnail}
      />
      <Name
        style={{
          width: (deviceWidth - 44) / 2,
        }}
        numberOfLines={1}>
        {data.name}
      </Name>
      <Price>{data.price ? Intl.NumberFormat().format(data.price) : '?'}원</Price>
    </ProductItemContainer>
  );
};

export default ProductItemList;
