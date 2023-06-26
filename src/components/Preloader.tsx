import { View } from 'react-native';
import { useEffect, useState } from 'react';
import getPosts from '../net/post/getPosts';
import tw from 'twrnc';
import { When } from 'react-if';
import FastImage from 'react-native-fast-image';
import { deviceWidth } from '../atoms/layout';
import { getResizePath } from '../utils';

export function Preloader() {
  const [position, setPosition] = useState(0);
  const [data, setData] = useState([]);

  // 앱을 시작하자마자 포스트를 읽어오면 정상 동작 하는지 테스트
  useEffect(() => {
    (async () => {
      try {
        const [{ data }] = await getPosts();
        setData(data.map((item: any) => getResizePath(item.image, deviceWidth / 3, deviceWidth / 3)));
      } catch (error) {}
    })();
  }, []);

  return (
    <View style={[tw`absolute`, { top: -9999, left: -9999 }]}>
      <When condition={data.length > 0 && !!data[position]}>
        <FastImage
          source={{ uri: data[position], priority: FastImage.priority.low }}
          style={tw`w-20 h-20`}
          onLoad={() => {
            setPosition(position + 1);
          }}
        />
      </When>
    </View>
  );
}
