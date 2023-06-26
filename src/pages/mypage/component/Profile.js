import React, { useState } from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Row, SpaceBetweenRow, Spacer } from '../../../atoms/layout';
import COLOR from '../../../../constants/COLOR';
import { Icon, ProfileImage } from '../../../atoms/image';
import TabModal from '../../../atoms/modal/TabModal';
import SmallButton from '../../../atoms/button/SmallButton';
import getMyFollowers from '../../../net/follow/getMyFollowers';
import getMyFollowings from '../../../net/follow/getMyFollowings';
import numberFormatter from '../../../utils/numberFormatter';

function Profile(props) {
  const { myData, isCommerceOn } = props;
  const navigation = useNavigation();
  const [followers, setFollowers] = React.useState(0);
  const [followings, setFollowings] = React.useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const points = myData?.points;
  const source = myData?.avatar;
  const userName = myData?.name;
  const instagram = myData?.instagram;

  useFocusEffect(
    React.useCallback(() => {
      fetchFollowers();
      fetchFollowings();

      return () => {
        init();
      };
    }, []),
  );

  const init = () => {
    setFollowers(null);
    setFollowings(null);
  };

  const fetchFollowers = async () => {
    try {
      const [data] = await getMyFollowers(1);
      setFollowers(data?.total);
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchFollowings = async () => {
    try {
      const [data] = await getMyFollowings(1);
      setFollowings(data?.total);
    } catch (error) {
      console.warn(error);
    }
  };
  return (
    <>
      <Component
        {...props}
        ref={props.ref}>
        <ProfileImage
          size={100}
          source={source}
        />
        <Spacer size={12} />
        {myData && (
          <Content>
            <SpaceBetweenRow>
              <Name>{userName}</Name>
              <Row centered>
                <Icon
                  source={require('../../../../assets/instagram.png')}
                  size={25}
                  onPress={() => {
                    instagram
                      ? Linking.openURL('https://www.instagram.com/' + instagram)
                      : Alert.alert('', '인스타그램 계정이 등록되어있지 않은 사용자 입니다.');
                  }}
                />
                <Spacer size={14} />
                <Icon
                  source={require('../../../../assets/moreIcon.png')}
                  size={22}
                  onPress={() => {
                    setVisibleModal(true);
                  }}
                />
              </Row>
            </SpaceBetweenRow>
            <Spacer size={14} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Followers', {
                  from: 'profile',
                  userName: userName,
                });
              }}>
              <Row centered>
                <SmallText>
                  <GrayText>팔로워</GrayText> {followers && numberFormatter(followers)}
                </SmallText>
                <Spacer size={6} />
                <Dot />
                <Spacer size={6} />
                <SmallText>
                  <GrayText>팔로잉</GrayText> {followings && numberFormatter(followings)}
                </SmallText>
              </Row>
            </TouchableOpacity>
            <Spacer size={4} />
            <Row>
              <SmallText>
                <GrayText>포인트</GrayText> {points && numberFormatter(points, true)}
              </SmallText>
            </Row>
            <Spacer size={8} />

            {isCommerceOn && (
              <Row>
                <SmallButton
                  onPress={() => {
                    navigation.navigate('Cart', {
                      screen: 'Cart',
                    });
                  }}
                  type={'border_primary'}>
                  장바구니
                </SmallButton>
                <Spacer size={13} />
                <SmallButton
                  onPress={() => {
                    navigation.navigate('PaymentHistory');
                  }}
                  type={'border_primary'}>
                  구매내역
                </SmallButton>
              </Row>
            )}
          </Content>
        )}

        {/*TabModal*/}
        {visibleModal && (
          <TabModal
            visible={visibleModal}
            setVisible={setVisibleModal}>
            <TabModal.Item
              label={'내 정보 수정하기'}
              onPress={() => {
                navigation.navigate('MySetting');
              }}
            />
            <TabModal.Item
              label={'문의'}
              onPress={() => {
                Linking.openURL('https://pairing.kr/app-ask');
              }}
            />
            <TabModal.Item
              label={'이용가이드'}
              onPress={() => {
                Linking.openURL('https://pairing.kr/app-about');
              }}
            />
          </TabModal>
        )}
      </Component>
    </>
  );
}

const Component = styled.View`
  flex-direction: row;
  padding-horizontal: 20px;
  padding-top: 20px;
  padding-bottom: 16px;

  background-color: #fff;
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

export default Profile;
