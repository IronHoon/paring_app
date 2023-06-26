import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../atoms/text';
import { Row } from '../../../atoms/layout';

const UserIdAndStar = (props) => {
  const { rankingItem, isFirst } = props;
  return (
    <View
      style={{
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text
          size={16}
          style={{ lineHeight: 18 }}>
          {rankingItem?.user?.name || rankingItem?.user?.nickname}
        </Text>
        <Row style={{ alignItems: 'center', marginTop: 5 }}>
          <View style={{ backgroundColor: 'rgb(24,156,196)', width: 4, height: 4, marginRight: 5, top: 1 }} />
          <Text
            size={10}
            style={{ marginRight: 5 }}>
            평점
          </Text>
          <Text size={10}>{rankingItem?.ratings_average}</Text>
        </Row>
      </View>
    </View>
  );
};

export default UserIdAndStar;
