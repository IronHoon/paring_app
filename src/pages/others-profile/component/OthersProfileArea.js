import React, { useCallback, useState } from 'react';
import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Row, SpaceBetweenRow, Spacer } from '../../../atoms/layout';
import COLOR from '../../../../constants/COLOR';
import { Icon } from '../../../atoms/image';
import { SmallButton } from '../../../atoms/button';
import getOthersFollowers from '../../../net/follow/getOthersFollowers';
import getOthersFollowings from '../../../net/follow/getOthersFollowings';
import numberFormatter from '../../../utils/numberFormatter';
import getFollowStatus from '../../../net/follow/getFollowStatus';
import patchFollowStatus from '../../../net/follow/patchFollowStatus';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';
import tw from 'twrnc';
import { ReportOrBlock } from '../../../components/organisms';

function OthersProfileArea({ userId, userData }) {
  const navigation = useNavigation();
  const source = userData?.avatar;
  const userName = userData?.name;
  const instagram = userData?.instagram;

  const [followers, setFollowers] = useState(null);
  const [followings, setFollowings] = useState(null);
  const [followed, setFollowed] = useState(null);

  useFocusEffect(
    useCallback(() => {
      init();
      fetchFollowers();
      fetchFollowings();
      userId && getFollowed();
    }, [userId, userData]),
  );
  useFocusEffect(
    useCallback(() => {
      return () => {
        init();
      };
    }, []),
  );

  const init = () => {
    setFollowers(null);
    setFollowings(null);
    setFollowed(null);
  };

  const fetchFollowers = async () => {
    try {
      const [data] = await getOthersFollowers(userId, 1);
      setFollowers(data?.total);
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchFollowings = async () => {
    try {
      const [data] = await getOthersFollowings(userId, 1);
      setFollowings(data?.total);
    } catch (error) {
      console.warn(error);
    }
  };

  const handlePressFollow = async () => {
    patchFollowed();
  };

  const getFollowed = async () => {
    try {
      const [data] = await getFollowStatus(userId);
      setFollowed(!!data?.id);
    } catch (error) {
      console.warn(error);
    }
  };

  const patchFollowed = async () => {
    try {
      const [data] = await patchFollowStatus(userId);
      setFollowed(!!data.id);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Component>
      <PressableOndemandImage
        imgSrc={source}
        defaultImg={require('../../../../assets/defaultProfileImage.png')}
        width={100}
        height={100}
        borderRadius={50}
      />
      <Spacer size={12} />
      <Content>
        <SpaceBetweenRow>
          <Name
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {userName}
          </Name>
          <Spacer size={4} />
          <Row centered>
            <Icon
              source={require('../../../../assets/instagram.png')}
              size={25}
              onPress={() => {
                {
                  instagram
                    ? Linking.openURL('https://www.instagram.com/' + instagram)
                    : Alert.alert('instagram', '인스타그램 계정이 등록되어있지 않은 사용자 입니다.');
                }
              }}
            />
            <Spacer size={14} />
            <Row style={{ width: 70 }}>
              {followed !== null && (
                <SmallButton
                  type={followed ? 'gray' : ''}
                  onPress={handlePressFollow}>
                  {followed ? '팔로잉' : '팔로우'}
                </SmallButton>
              )}
            </Row>
          </Row>
        </SpaceBetweenRow>
        <Spacer size={14} />
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OthersFollowers', {
                userId: userId,
                userName: userName,
              });
            }}>
            <Row centered>
              <SmallText>
                <GrayText>팔로워</GrayText> {followers !== null ? numberFormatter(followers) : '-'}
              </SmallText>
              <Spacer size={6} />
              <Dot />
              <Spacer size={6} />
              <SmallText>
                <GrayText>팔로잉</GrayText> {followings !== null ? numberFormatter(followings) : '-'}
              </SmallText>
            </Row>
          </TouchableOpacity>
          <ReportOrBlock
            target_table={'users'}
            target_id={userId}
          />
        </View>
      </Content>
    </Component>
  );
}

const Component = styled.View`
  flex-direction: row;
  padding-horizontal: 20px;
  padding-top: 20px;
  padding-bottom: 16px;
`;

const Content = styled.View`
  flex: 1;
  padding-top: 15px;
`;

const Name = styled.Text`
  font-size: 20px;
  line-height: 22px;
  color: #000;
  overflow: hidden;
  flex: 1;
`;

const SmallText = styled.Text`
  font-size: 13px;
`;
const GrayText = styled.Text`
  color: ${COLOR.LIGHT_GRAY};
`;

const Dot = styled.View`
  width: 3px;
  height: 3px;
  border-radius: 2px;
  background-color: rgba(191, 191, 191, 1);
`;

const FixedProfile = styled.View`
  flex-direction: row;
  height: 80px;
  align-items: center;
  padding-horizontal: 20px;
`;

export default OthersProfileArea;
