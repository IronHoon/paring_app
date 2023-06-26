import OthersProfileArea from './OthersProfileArea';
import { GraySpace, Spacer } from '../../../atoms/layout';
import ConnectsArea from './ConnectsArea';
import { Spinner } from '../../../atoms/image';
import React, { useCallback, useState } from 'react';
import getOthersConnect from '../../../net/user/getOthersConnect';
import { useContextQ } from 'context-q';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Pressable, View } from 'react-native';
import tw from 'twrnc';
import { Text } from '../../../atoms/text';
import COLOR from '../../../../constants/COLOR';

type Props = {
  userId: number;
  userData: any;
  activeTab: 'daily' | 'merchandises';
};

export function OthersProfileHeader({ userId, userData, activeTab }: Props) {
  const [connectData, setConnectData] = useState({});
  const context = useContextQ();
  const navigation = useNavigation();

  const getOthersConnectData = () => {
    const fetchData = async () => {
      try {
        const [data] = await getOthersConnect(userId);
        setConnectData(data);
      } catch (error) {
        console.warn(error);
      }
    };

    fetchData();
  };

  useFocusEffect(
    useCallback(() => {
      getOthersConnectData();
    }, []),
  );

  return (
    <>
      <OthersProfileArea
        userId={userId}
        userData={userData}
      />
      <GraySpace />
      <Spacer height={17} />
      {connectData ? (
        <ConnectsArea
          userData={userData}
          connectData={connectData}
          myId={context?.user?.id}
        />
      ) : (
        <Spinner />
      )}
      <GraySpace height={9} />

      <View style={tw`flex-row border-b border-gray-300 mb-3`}>
        <Pressable
          style={tw`flex-1 items-center`}
          onPress={() => {
            navigation.navigate('OthersProfile', {
              screen: 'OthersProfile',
              params: { userId: userId },
            });
          }}>
          <View
            style={[
              tw`py-3 px-2`,
              {
                borderBottomWidth: activeTab === 'daily' ? 2 : 0,
                borderBottomColor: COLOR.PRIMARY,
              },
            ]}>
            <Text style={tw`text-black font-bold`}>데일리룩</Text>
          </View>
        </Pressable>
        <Pressable
          style={tw`flex-1 items-center`}
          onPress={() => {
            navigation.navigate('OthersMerchandises', { userId: userId });
          }}>
          <View
            style={[
              tw`py-3`,
              {
                borderBottomWidth: activeTab === 'merchandises' ? 2 : 0,
                borderBottomColor: COLOR.PRIMARY,
              },
            ]}>
            <Text style={tw`text-black font-bold`}>판매 아이템</Text>
          </View>
        </Pressable>
      </View>
    </>
  );
}
