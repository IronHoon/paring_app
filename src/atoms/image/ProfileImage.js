import React from 'react';

import PressableOndemandImage from './PressableOndemandImage';

const ProfileImage = ({ source, size = 30, onPress }) => {
  return (
    <PressableOndemandImage
      borderRadius={Math.ceil(size / 2)}
      defaultImg={require('../../../assets/defaultProfileImage.png')}
      imgSrc={source}
      width={size}
      height={size}
      handlePressItem={onPress}
    />
  );
};

export default ProfileImage;
