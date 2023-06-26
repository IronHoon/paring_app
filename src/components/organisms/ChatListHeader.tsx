import tw from 'twrnc';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../../../constants/COLOR';

export function ChatListHeader({ active }: { active: '메세지' | '구매내역' | '판매내역' }) {
  const navigation = useNavigation();
  return (
    <View style={[tw`flex-row border-b border-gray-300`, { height: 40 }]}>
      <Pressable
        style={[tw`flex-1 items-center`]}
        onPress={() => navigation.navigate('ChatRoomPages')}>
        <Text style={[tw`font-bold text-black  py-2`]}>메세지</Text>
        <View
          style={{
            position: 'absolute',
            bottom: -1,
            width: Dimensions.get('window').width * 0.18,
            borderBottomColor: active === '메세지' ? COLOR.PRIMARY : 'transparent',
            borderBottomWidth: 2,
          }}
        />
      </Pressable>
      <Pressable
        style={tw`flex-1 items-center`}
        onPress={() => {
          navigation.navigate('UsedOrderList');
        }}>
        <Text style={[tw`font-bold text-black py-2`]}>구매내역</Text>
        <View
          style={{
            position: 'absolute',
            bottom: -1,
            width: Dimensions.get('window').width * 0.18,
            borderBottomColor: active === '구매내역' ? COLOR.PRIMARY : 'transparent',
            borderBottomWidth: 2,
          }}
        />
      </Pressable>
      <Pressable
        style={tw`flex-1 items-center`}
        onPress={() => {
          navigation.navigate('UsedSalesList');
        }}>
        <Text style={[tw`font-bold text-black py-2`]}>판매내역</Text>
        <View
          style={{
            position: 'absolute',
            bottom: -1,
            width: Dimensions.get('window').width * 0.18,
            borderBottomColor: active === '판매내역' ? COLOR.PRIMARY : 'transparent',
            borderBottomWidth: 2,
          }}
        />
      </Pressable>
    </View>
  );
}
