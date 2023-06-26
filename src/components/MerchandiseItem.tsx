import tw from 'twrnc';
import FastImage from 'react-native-fast-image';
import { Pressable, Text, View } from 'react-native';
import { MerchandiseType } from '../types';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import { Spacer } from '../atoms/layout';

type Props = {
  merchandise: MerchandiseType;
  width?: number;
};

const formatter = new Intl.NumberFormat('ko-KR');

export function MerchandiseItem({ merchandise, width = 100 }: Props) {
  const navigation = useNavigation();
  const size = width;
  return (
    <Pressable
      key={merchandise.id}
      style={{ paddingTop: 10, borderBottomColor: COLOR.BORDER_GREY, borderBottomWidth: 1, paddingBottom: 5 }}
      onPress={() => {
        navigation.navigate('MerchandiseDetailPage', {
          id: merchandise.id,
        });
      }}>
      <FastImage
        source={{ uri: merchandise.images.split(',')[0] }}
        style={{ width: size, height: size }}
      />
      <Spacer height={3} />
      <View style={{ height: 45 }}>
        <Text style={[tw`text-black font-bold`, { fontSize: 14 }]}>{merchandise.brand}</Text>
        <Text style={[{ fontSize: 12, color: 'rgb(88,88,90)' }]}>{merchandise.name}</Text>
        <Text style={[tw`text-black font-bold`, { fontSize: 14 }]}>{formatter.format(merchandise.price)}원</Text>
      </View>
    </Pressable>
  );
}
