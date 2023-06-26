import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import COLOR from '../../../constants/COLOR';
import FastImage from 'react-native-fast-image';

const SlideItem = (props) => {
  const { item, handlePressItem, size = 112 } = props;
  return (
    <Pressable
      style={[styles.container, { width: size || 112, height: size || 112 }]}
      onPress={() => {
        handlePressItem?.(item);
      }}>
      <FastImage
        borderRadius={12}
        resizeMode={'cover'}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
        source={
          item?.image || item?.thumbnail
            ? { uri: item?.image || item?.thumbnail }
            : require('../../../assets/iconLogoBlack.png')
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: COLOR.HR_GRAY,
  },
});

export default SlideItem;
