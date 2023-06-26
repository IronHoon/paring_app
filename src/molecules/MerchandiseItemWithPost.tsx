import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import COLOR from '../../constants/COLOR';
import { Spacer } from '../atoms/layout';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export function MerchandiseItemWithPost({ item, index, searchTxt }: { item: any; index: number; searchTxt: string }) {
  const WIDTH = Dimensions.get('window').width;
  const navigation = useNavigation();
  const price = (Number(item.price.toString().replace(/\D/g, '')) || '').toLocaleString();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('StyleFeed', {
          screen: 'StyleFeed',
          params: {
            feed: item?.posts[0],
            feedId: item?.posts[0].id,
            from: 'searchMerchandise',
            searchText: searchTxt,
          },
        });
      }}
      style={[
        {
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(243,243,243,1)',
          borderRightWidth: index % 2 === 0 ? 1 : 0,
          borderRightColor: 'rgba(243,243,243,1)',
          width: WIDTH * 0.5,
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tw`relative`,
      ]}>
      {item.posts.length > 0 && (
        <View>
          <Image
            source={{ uri: item.posts[0].image }}
            style={{
              width: WIDTH * 0.5 - 10,
              height: WIDTH * 0.5 - 10,
              backgroundColor: COLOR.LIGHT_GRAY,
            }}></Image>
          {item.order_status === '거래완료' && (
            <View style={tw`absolute w-full h-full top-0 left-0 justify-center items-center`}>
              {/*반투명 배경*/}
              <View style={tw`bg-black opacity-50 w-full h-full absolute`} />
              <Text style={tw`text-xl text-white`}>판매완료</Text>
            </View>
          )}
        </View>
      )}
      <View
        style={{
          width: WIDTH * 0.5,
          height: WIDTH * 0.2 + 10,
          padding: 5,
          alignItems: 'center',
          flexDirection: 'row',
          paddingBottom: 0,
        }}>
        <Image
          source={{ uri: item.images.split(',')[0] }}
          style={{
            width: WIDTH * 0.2,
            height: WIDTH * 0.2,
            backgroundColor: 'grey',
          }}></Image>
        <View style={{ paddingLeft: 8 }}>
          <Text
            style={{ fontSize: 14, fontWeight: 'bold' }}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {item.brand}
          </Text>
          <Spacer height={3} />
          <Text
            style={{ fontSize: 11, color: 'rgba(88,88,90,1)' }}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {item.name}
          </Text>
          <Spacer height={3} />

          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{price + '원'}</Text>
        </View>
      </View>
    </Pressable>
  );
}
