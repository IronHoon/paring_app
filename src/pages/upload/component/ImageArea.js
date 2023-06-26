import React, { useState } from 'react';
import { Image, Pressable } from 'react-native';
import { Spinner } from '../../../atoms/image';
import { uploadImages } from '../../../utils';

const ImageArea = (props) => {
  const { feedData, setFeedData } = props;
  const [loading, setLoading] = useState(false);

  return (
    <Pressable
      style={{
        width: 97,
        height: 97,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgb(210,210,210)',
        borderWidth: 1,
        borderRadius: 8,
      }}
      onPress={async (e) => {
        try {
          setLoading(true);
          const urls = await uploadImages({ maxSelectedAssets: 1 });
          setFeedData({ ...props.feedData, feedImage: urls[0] });
        } finally {
          setLoading(false);
        }
      }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {feedData?.feedImage ? (
            <Image
              style={{ width: 97, height: 97, borderRadius: 8 }}
              source={{ uri: feedData.feedImage }}
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

export default ImageArea;
