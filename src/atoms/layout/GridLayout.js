import React, { useRef } from 'react';
import { Dimensions, FlatList, View } from 'react-native';

import PressableOndemandImage from '../image/PressableOndemandImage';
import { getResizePath } from '../../utils';

const GridLayout = ({
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
  const windowWidth = Dimensions.get('window').width;
  const itemSize = (windowWidth / 3) * 2;

  return (
    <View style={{ flex: 1 }}>
      {dataset.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}_${item.id}`}
          data={dataset}
          numColumns={3}
          renderItem={({ item }) => (
            <PressableOndemandImage
              handlePressItem={() => {
                handlePressItem?.(item);
              }}
              imgSrc={item?.image}
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
    </View>
  );
};

export default GridLayout;
