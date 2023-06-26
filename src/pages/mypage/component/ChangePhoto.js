import React, { useState } from 'react';
import { Image, Pressable } from 'react-native';
import { Spinner } from '../../../atoms/image';
import { uploadImages } from '../../../utils';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const ChangePhoto = (props) => {
  const { userData, setUserData } = props;
  const [preview, setPreview] = useState(userData?.avatar);
  const [loading, setLoading] = useState(false);

  return (
    <Pressable
      style={{
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efefef',
        borderRadius: 50,
        overflow: 'hidden',
      }}
      onPress={async () => {
        try {
          setLoading(true);
          const [uri] = await uploadImages({ maxSelectedAssets: 1 });
          setUserData({ ...userData, avatar: uri });
        } finally {
          setLoading(false);
        }
      }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {userData?.avatar && preview ? (
            <Image
              style={{ width: 100, height: 100, borderRadius: 50 }}
              source={{ uri: userData?.avatar || preview.uri }}
              resizeMode={'cover'}
            />
          ) : (
            <Image
              style={{ width: 29, height: 23 }}
              source={require('../../../../assets/camera.png')}
            />
          )}
        </>
      )}
    </Pressable>
  );
};

export default ChangePhoto;
