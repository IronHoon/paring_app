import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';

import { Row, Spacer } from '../../../atoms/layout';
import { SmallButton } from '../../../atoms/button';
import patchFollowStatus from '../../../net/follow/patchFollowStatus';
import getFollowStatus from '../../../net/follow/getFollowStatus';
import { ProfileImage } from '../../../atoms/image';

function FollowItem(props) {
  const { userId, myId, ownerId, source } = props;
  const [localFollowed, setLocalFollowed] = React.useState(null);

  const navigation = useNavigation();

  const isMine = userId === myId;

  useEffect(() => {
    getFollow();
  }, []);

  const getFollow = async () => {
    const [data] = await getFollowStatus(userId);
    setLocalFollowed(!!data.id);
  };

  const patchFollow = async () => {
    const [data] = await patchFollowStatus(userId);
    if (data?.id) {
      setLocalFollowed(true);
    } else {
      setLocalFollowed(false);
    }
  };

  return (
    <Component>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (isMine) {
            navigation.navigate('MyPage', {
              screen: 'MyPage',
            });
          } else {
            navigation.navigate('OthersProfile', { userId: userId });
            // navigation.navigate('OthersProfile', {
            //   screen: 'OthersProfile',
            //   params: { userId: userId },
            // });
          }
        }}>
        <Row centered>
          <ProfileImage
            size={58}
            source={source}
          />
          <Spacer size={13} />
          <Name numberOfLines={1}>{props?.name}</Name>
        </Row>
      </Pressable>
      {localFollowed !== null && !isMine && (
        <SmallButton
          type={localFollowed ? 'gray' : ''}
          onPress={() => {
            patchFollow?.();
            props.handlePressButton?.();
          }}>
          {localFollowed ? '팔로잉' : '팔로우'}
        </SmallButton>
      )}
    </Component>
  );
}

const Component = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 11px;
`;
const Name = styled.Text`
  font-size: 15px;
  color: #000;
  overflow: hidden;
  flex: 1;
  padding-right: 10px;
`;

export default FollowItem;
