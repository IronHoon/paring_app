import React, { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components';

import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import { NavHead } from '../../../components/layouts';

import { Spacer } from '../../../atoms/layout';
import COLOR from '../../../../constants/COLOR';
import FollowItem from '../component/FollowItem';
import numberFormatter from '../../../utils/numberFormatter';
import { useFocusEffect } from '@react-navigation/native';
import getOthersFollowers from '../../../net/follow/getOthersFollowers';
import getOthersFollowings from '../../../net/follow/getOthersFollowings';
import { Spinner } from '../../../atoms/image';
import { withContext } from 'context-q';

function OthersFollowersPage(props) {
  const params = props.route?.params;
  const myId = props?.context?.user?.id;
  const ownerId = params?.userId;

  const onEndReachedCalledDuringMomentum1 = useRef();
  const onEndReachedCalledDuringMomentum2 = useRef();

  const [activeTab, setActiveTab] = useState('followers');

  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [totalFollowers, setTotalFollowers] = useState('-');
  const pageFollowers = useRef();
  const lastPageFollowers = useRef();
  const datasetFollowers = useRef();

  const [loadingFollowings, setLoadingFollowings] = useState(false);
  const [totalFollowings, setTotalFollowings] = useState('-');
  const pageFollowings = useRef();
  const lastPageFollowings = useRef();
  const datasetFollowings = useRef();

  useFocusEffect(
    React.useCallback(() => {
      init();
      getFollowersData();
      getFollowingsData();

      return () => {
        init();
      };
    }, [props.route?.params]),
  );

  const init = () => {
    setLoadingFollowers(true);
    setTotalFollowers(null);
    datasetFollowers.current = [];
    pageFollowers.current = 1;
    lastPageFollowers.current = 1;

    setLoadingFollowings(true);
    setTotalFollowings(null);
    datasetFollowings.current = [];
    pageFollowings.current = 1;
    lastPageFollowings.current = 1;
  };

  const getFollowersData = async () => {
    setLoadingFollowers(true);
    try {
      const [data] = await getOthersFollowers(ownerId, pageFollowers.current);
      const _data = data?.data;
      setTotalFollowers(data?.total);
      lastPageFollowers.current = data?.lastPage;

      if (!(pageFollowers.current > lastPageFollowers.current)) {
        pageFollowers.current += 1;
        datasetFollowers.current = [...datasetFollowers.current, ..._data];
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const getFollowingsData = async () => {
    setLoadingFollowings(true);
    try {
      const [data] = await getOthersFollowings(ownerId, pageFollowings.current);
      const _data = data?.data;
      setTotalFollowings(data?.total);
      lastPageFollowings.current = data?.lastPage;

      if (!(pageFollowings.current > lastPageFollowings.current)) {
        pageFollowings.current += 1;
        datasetFollowings.current = [...datasetFollowings.current, ..._data];
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoadingFollowings(false);
    }
  };

  const onEndReachedFollowers = () => {
    if (loadingFollowers && !(pageFollowers.current > lastPageFollowers.current)) {
      return false;
    } else {
      getFollowersData();
    }
  };

  const onEndReachedFollowings = () => {
    if (loadingFollowings && !(pageFollowings.current > lastPageFollowings.current)) {
      return false;
    } else {
      getFollowingsData();
    }
  };

  const _FollowerItem = ({ item, index }) => {
    return (
      <FollowItem
        key={index?.toString()}
        id={item?.id}
        userId={item?.follower.id}
        source={item?.follower?.avatar}
        name={item?.follower?.name}
        myId={myId}
        ownerId={ownerId}
      />
    );
  };

  const _FollowingItem = ({ item, index }) => {
    return (
      <FollowItem
        key={index?.toString()}
        id={item?.id}
        userId={item?.following.id}
        source={item?.following?.avatar}
        name={item?.following?.name}
        myId={myId}
        ownerId={ownerId}
      />
    );
  };

  return (
    <WhiteSafeArea>
      <NavHead
        textAlignLeft
        title={params?.userName}
      />
      <Spacer height={20} />
      <Tabs
        followers={totalFollowers}
        followings={totalFollowings}
        activeTab={activeTab}
        handleTab={(status) => {
          init();
          getFollowersData(true);
          getFollowingsData(true);
          setActiveTab(status);
        }}
      />

      <Spacer height={5} />

      {activeTab === 'followers' && (
        <>
          {datasetFollowers.current?.length === 0 && loadingFollowers && <Spinner />}
          {datasetFollowers.current?.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => `${index}_${item.id}`}
              data={datasetFollowers.current}
              renderItem={_FollowerItem}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum1.current = false;
              }}
              onEndReached={(e) => {
                if (!onEndReachedCalledDuringMomentum1.current) {
                  onEndReachedFollowers(e); // LOAD MORE DATA
                  onEndReachedCalledDuringMomentum1.current = true;
                }
              }}
              ListFooterComponent={pageFollowers.current <= lastPageFollowers.current && <Spinner />}
            />
          )}
        </>
      )}

      {activeTab === 'followings' && (
        <>
          {datasetFollowings.current?.length === 0 && loadingFollowings && <Spinner />}
          {datasetFollowings.current?.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => String(index)}
              data={datasetFollowings.current}
              renderItem={_FollowingItem}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum2.current = false;
              }}
              onEndReached={(e) => {
                if (!onEndReachedCalledDuringMomentum2.current) {
                  onEndReachedFollowings(e); // LOAD MORE DATA
                  onEndReachedCalledDuringMomentum2.current = true;
                }
              }}
              ListFooterComponent={pageFollowings.current <= lastPageFollowings.current && <Spinner />}
            />
          )}
        </>
      )}
    </WhiteSafeArea>
  );
}

const Tabs = ({ followers, followings, activeTab, handleTab }) => {
  return (
    <TabContainer>
      <TabItem
        onPress={() => {
          handleTab('followers');
        }}>
        <TabInner active={activeTab === 'followers'}>
          <TabText>팔로워 {followers !== null && numberFormatter(followers)}</TabText>
        </TabInner>
      </TabItem>
      <TabItem
        onPress={() => {
          handleTab('followings');
        }}>
        <TabInner active={activeTab === 'followings'}>
          <TabText>팔로잉 {followings !== null && numberFormatter(followings)}</TabText>
        </TabInner>
      </TabItem>
    </TabContainer>
  );
};

const TabContainer = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-color: ${COLOR.BORDER};
`;
const TabItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const TabInner = styled.View`
  align-items: center;
  justify-content: center;
  border-bottom-width: 2px;
  height: 40px;
  ${({ active }) => (active ? `border-color: rgba(83, 83, 83, 1);` : `border-color: rgba(83, 83, 83, 0);`)}
`;

const TabText = styled.Text`
  font-size: 15px;
`;

OthersFollowersPage = withContext(OthersFollowersPage);
export default OthersFollowersPage;
