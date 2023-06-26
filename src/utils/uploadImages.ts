// @ts-ignore
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import RNFS from 'react-native-fs';
// @ts-ignore
import RNHeicConverter from 'react-native-heic-converter';
import { upload } from './s3';
import { CDN_HOST } from '@env';

type Props = {
  maxSelectedAssets: number;
};

export async function uploadImages({ maxSelectedAssets = 20 }) {
  try {
    const response = await openPicker({
      mediaType: 'image',
      maxSelectedAssets,
    });

    const results = await Promise.all(
      response.map((item: any) => {
        return RNFS.readFile(item.path, 'base64').then(async (res) => {
          if (item.mime === 'image/heic') {
            const heic = await RNHeicConverter.convert({
              // options
              path: item.path,
            });
            const convertResult = await RNFS.readFile(heic.path, 'base64');

            return upload(convertResult, 'image/jpg', item.fileName.replace('.heic', '.jpg').replace('.HEIC', '.jpg'));
          } else {
            return upload(res, item.mime, item.fileName);
          }
        });
      }),
    );

    return results.map((item: any) => `${CDN_HOST}/${item.Key}`);
  } catch (error) {
    throw error;
  }
}
