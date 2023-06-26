import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable } from 'react-native';

import { deviceWidth } from '../layout';
import { getResizePath } from '../../utils';
import { Else, If, Then } from 'react-if';
import tw from 'twrnc';
import FastImage, { Priority } from 'react-native-fast-image';

type Props = {
  imgSrc: string;
  style?: any;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  defaultImg?: any;
  handlePressItem?: any;
  noCrop?: boolean;
  priority?: Priority;
};

const PressableOndemandImage = ({
  imgSrc,
  style = {},
  width = deviceWidth / 3,
  height = deviceWidth / 3,
  borderRadius = 0,
  defaultImg = require('../../../assets/dummy/no_img.png'),
  handlePressItem,
  noCrop = false,
  priority = FastImage.priority.normal,
}: Props) => {
  const [originWidth, setOriginWidth] = useState(0);
  const [originHeight, setOriginHeight] = useState(0);
  const calcWidth = useMemo(() => {
    // width 가 string 으로 들어올 경우 deviceWidth 를 사용한다
    if (typeof width === 'string') {
      return deviceWidth * 2;
    }
    return width * 2;
  }, [width]);
  const [failCount, setFailCount] = useState(0);

  const calcHeight = useMemo(() => {
    // noCrop = true 이고 getImage 결과가 있을 때 크기 다시 계산
    if (noCrop) {
      if (originWidth > 0 && originHeight > 0) {
        return (originHeight / originWidth) * calcWidth;
      }
    }
    // height 가 없을 경우 width 값을 그대로 사용한다.
    if (!height) {
      return calcWidth;
    }
    // height 가 string 으로 들어올 경우 deviceWidth 를 사용한다
    if (typeof height === 'string') {
      return deviceWidth * 2;
    }
    return height * 2;
  }, [height, originWidth, originHeight, calcWidth]);

  useEffect(() => {
    if (noCrop) {
      Image.getSize(imgSrc, (width, height) => {
        setOriginWidth(width);
        setOriginHeight(height);
      });
    }
  }, []);

  const uri = useMemo(() => {
    if (!noCrop) {
      // 로드를 실패했다면 코덱 문제일 수 있으니 원본을 다시 로드한다.
      if (failCount > 0) {
        return imgSrc;
      } else {
        return getResizePath(imgSrc, calcWidth, calcHeight);
      }
    } else {
      return imgSrc;
    }
  }, [noCrop, imgSrc, calcWidth, calcHeight, failCount]);

  return (
    <Pressable
      style={{
        width: !noCrop ? width : calcWidth / 2,
        height: !noCrop ? height : calcHeight / 2,
        backgroundColor: '#eee',
        borderRadius: borderRadius,
        ...style,
      }}
      onPress={handlePressItem}>
      <If condition={imgSrc}>
        <Then>
          <FastImage
            style={[tw`w-full h-full`, { borderRadius }]}
            resizeMode={noCrop ? 'contain' : 'cover'}
            source={{
              uri,
              priority,
            }}
            onError={() => {
              setFailCount((count) => count + 1);
            }}
          />
        </Then>
        <Else>
          <Image
            style={[tw`w-full h-full`, { borderRadius }]}
            resizeMode={'cover'}
            source={defaultImg}
          />
        </Else>
      </If>
    </Pressable>
  );
};

export default PressableOndemandImage;
