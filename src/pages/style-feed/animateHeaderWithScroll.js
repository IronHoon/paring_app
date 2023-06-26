/*scroll*/
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

const headerHeight = 44;

export const animateHeaderWithScroll = (ref) => {
  const scrollY = useRef();
  const [scrollWay, setScrollWay] = useState(null);

  const [animatedValue] = useState(new Animated.Value(0));
  const [animatedValue2] = useState(new Animated.Value(0));

  const animatedTransformY = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, -44] });
  const animatedOpacity = animatedValue2.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const checkHeaderScrolled = (e) => {
    const newScrollY = e.nativeEvent.contentOffset.y;

    if (newScrollY > headerHeight && newScrollY !== scrollY.current) {
      const newScrollWay = newScrollY - scrollY.current > 0 ? 'down' : 'up';
      newScrollWay !== scrollWay && setScrollWay(newScrollWay);
      scrollY.current = e.nativeEvent.contentOffset.y;
    }
  };

  useEffect(() => {
    const v = scrollWay === 'down' ? 1 : 0;
    Animated.timing(animatedValue, {
      toValue: v,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
    Animated.timing(animatedValue2, {
      toValue: v,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [scrollWay]);

  useEffect(() => {
    return () => {
      setScrollWay(null);
    };
  }, []);

  return [animatedTransformY, animatedOpacity, checkHeaderScrolled];
};
