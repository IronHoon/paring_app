import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
import { Text } from '../../../atoms/text';
import { Row, Spacer } from '../../../atoms/layout';
import weekNumberInMonth from '../../../utils/WeekNumberInMonth';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';
import { getResizePath } from '../../../utils';

const SpreadableRanking = ({ item, spread, handleSelectedItem }) => {
  const { content, basis_date } = item;
  const [isSpread, setIsSpread] = useState(spread || false);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (basis_date) {
      const weekObject = weekNumberInMonth(basis_date);
      setDate(weekObject);
    }
  }, [basis_date]);

  return (
    <View>
      {isSpread ? (
        <>
          <WeekText>{date && `${date?.year}년 ${date?.month}월 ${date?.weekNo}주차`}</WeekText>
          <Spacer height={15} />
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <GenderItemComponent
              gender={'WOMAN'}
              source={content?.womanWinner}
              handleSelectedItem={() => handleSelectedItem(item, 'WOMAN')}
            />
            <Spacer width={2} />
            <GenderItemComponent
              gender={'MAN'}
              source={content?.manWinner}
              handleSelectedItem={() => handleSelectedItem(item, 'MAN')}
            />
          </Row>
          <Spacer height={50} />
        </>
      ) : (
        <>
          <MoreButton
            onPress={() => {
              setIsSpread(true);
            }}>
            <Text size={14}>{date && `${date?.year}년 ${date?.month}월 ${date?.weekNo}주차`} 랭킹 보기</Text>
          </MoreButton>
        </>
      )}
    </View>
  );
};

const GenderItemComponent = ({ source, weekText, gender, handleSelectedItem }) => {
  return (
    <GenderItem onPress={handleSelectedItem}>
      <PressableOndemandImage
        imgSrc={getResizePath(source, 249, 600)}
        width={123}
        height={300}
        handlePressItem={handleSelectedItem}
      />
      <Spacer height={5} />
      <Text size={17}>{gender}</Text>
    </GenderItem>
  );
};

const GenderItem = styled.Pressable`
  align-items: center;
  width: 123px;
`;
const RankerImage = styled.Image`
  width: 123px;
  height: 300px;
`;
const MoreButton = styled.Pressable`
  border-radius: 8px;
  height: 32px;
  border-color: rgb(220, 220, 220);
  border-width: 1px;
  justify-content: center;
  align-items: center;
  margin-horizontal: 22px;
  margin-bottom: 32px;
`;
const WeekText = styled.Text`
  font-size: 17px;
  text-align: center;
`;
export default SpreadableRanking;
