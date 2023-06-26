import { Dimensions, ScrollView, View } from 'react-native';
import { NavHead, WhiteSafeArea } from '../../../components/layouts';
import { OthersProfileHeader } from '../component';
import getOthersInfo from '../../../net/user/getOthersInfo';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import tw from 'twrnc';
import { useFetch } from '../../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../../components/layouts/SwrContainer';
import { MerchandiseType } from '../../../types';
import { MerchandiseItem } from '../../../components';
import { Spacer } from '../../../atoms/layout';

export function OthersMerchandisesPage({ route }: any) {
  const userId = route.params.userId;
  const [userData, setUserData] = useState([]);
  const { data, error } = useFetch<any>(`${API_HOST}/v1/users/${userId}/merchandises`);

  const getOthersInfoData = () => {
    const fetchData = async () => {
      try {
        const [data] = await getOthersInfo(userId);
        setUserData(data);
      } catch (error) {
        console.warn(error);
      }
    };

    fetchData();
  };

  useFocusEffect(
    useCallback(() => {
      getOthersInfoData();
    }, [userId]),
  );

  const WINDOW_WIDTH = Dimensions.get('window').width;
  const GAP = 12;
  const ITEMS_PER_ROW = 3;
  const ITEM_WIDTH = (WINDOW_WIDTH - GAP * (ITEMS_PER_ROW + 1)) / ITEMS_PER_ROW;

  return (
    <WhiteSafeArea>
      <NavHead
        title={undefined}
        right={undefined}
        children={undefined}
        onLeftPress={undefined}
        left={undefined}
      />
      <ScrollView style={tw`bg-white`}>
        <OthersProfileHeader
          userId={userId}
          userData={userData}
          activeTab={'merchandises'}
        />
        <SwrContainer
          data={data}
          error={error}>
          <View style={tw`flex-row flex-wrap`}>
            {data &&
              data.data.map((merchandise: MerchandiseType) => (
                <View
                  key={merchandise.id.toString()}
                  style={{ marginLeft: GAP }}>
                  <MerchandiseItem
                    merchandise={merchandise}
                    width={ITEM_WIDTH}
                  />
                </View>
              ))}
          </View>
        </SwrContainer>
        <Spacer height={36} />
      </ScrollView>
    </WhiteSafeArea>
  );
}
