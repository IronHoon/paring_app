import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../../atoms/text';
import RankingDetailHeader from './RankingDetailHeader';
import { Row, Spacer } from '../../../atoms/layout';
import UserIdAndStar from './UserIdAndStar';
import { ProfileImage, Spinner } from '../../../atoms/image';
import COLOR from '../../../../constants/COLOR';

const SelectGenderTab = ({ selectedGender, setSelectedGender }) => {
  return (
    <Row style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 30, paddingHorizontal: 5 }}>
      <GenderTab
        onPress={() => {
          setSelectedGender('WOMAN');
        }}>
        <GenderTabText selected={selectedGender === 'WOMAN'}>WOMAN</GenderTabText>
      </GenderTab>
      <GenderTabDivider />
      <GenderTab
        onPress={() => {
          setSelectedGender('MAN');
        }}>
        <GenderTabText selected={selectedGender === 'MAN'}>MAN</GenderTabText>
      </GenderTab>
    </Row>
  );
};

function RankingDetail(props) {
  const { selected, setSelected, selectedGender, setSelectedGender } = props;
  const navigation = useNavigation();

  // const [rankingData, setRankingData] = useState([]);
  const [selectedGenderData, setSelectedGenderData] = useState(null);

  useEffect(() => {
    selectedGender === 'WOMAN'
      ? setSelectedGenderData(selected?.content?.women)
      : setSelectedGenderData(selected?.content?.men);
  }, [selected, selectedGender]);

  const handlePress = (data) => {
    navigation.navigate('SinglePostDetail', {
      screen: 'SinglePostDetail',
      params: {
        feedId: data?.id,
        from: 'ranking',
      },
    });
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <SelectGenderTab
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
      />
      <View>
        {!selectedGenderData && <Spinner />}
        {selected && selectedGenderData && (
          <>
            <RankingDetailHeader
              data={selectedGenderData?.[0]}
              handlePress={handlePress}
            />
            <Spacer height={12} />
            {selectedGenderData?.map?.((item, index) => {
              if (index === 0 || item === null) {
                return null;
              } else {
                return (
                  <Pressable
                    key={`${index}_${item.id}`}
                    onPress={() => {
                      handlePress(item);
                    }}>
                    <Row
                      style={{ marginBottom: 18, paddingHorizontal: 15 }}
                      centered>
                      <Row style={{ width: 36 }}>
                        <Text size={21}>{index + 1}</Text>
                      </Row>
                      <Row style={{ alignItems: 'center', flex: 1 }}>
                        <ProfileImage
                          size={58}
                          source={item?.image}
                        />
                        <Spacer width={18} />
                        <UserIdAndStar rankingItem={item} />
                      </Row>
                      <View>
                        <ArrowImage
                          resizeMode={'contain'}
                          source={require('../../../../assets/arrow_down.png')}
                        />
                      </View>
                    </Row>
                  </Pressable>
                );
              }
            })}
          </>
        )}
      </View>
    </View>
  );
}

const GenderTab = styled.Pressable`
  padding-horizontal: 8px;
`;
const GenderTabDivider = styled.View`
  top: 1px;
  width: 1px;
  height: 13px;
  background-color: rgb(220, 220, 220);
`;
const GenderTabText = styled.Text`
  font-size: 15px;
  letter-spacing: -0.38px;
  ${({ selected }) => (selected ? `color:${COLOR.PRIMARY}` : `color:#000`)}
`;

const ArrowImage = styled.Image`
  transform: rotate(270deg);
  width: 18px;
  height: 9px;
  opacity: 0.9;
  tint-color: #000;
`;

export default RankingDetail;
