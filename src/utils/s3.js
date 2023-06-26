import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import moment from 'moment';
import { AWS_REGION, BUCKET_NAME, IDENTITY_POOL_ID } from '@env';
import { decode } from 'base64-arraybuffer-es6';
// Amazon Cognito 인증 공급자를 초기화합니다
AWS.config.region = AWS_REGION; // 리전
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: IDENTITY_POOL_ID,
});
const s3 = new S3({
  apiVersion: '2006-03-01',
  params: { Bucket: BUCKET_NAME },
  signatureVersion: 'v4',
});

export const upload = async (file, type, name) => {
  // 버킷 상에 저장될 파일 경로를 생성합니다.
  // 동일 경로가 생성될 경우 이전 파일을 덮어쓰기 때문에 최대한 겹치지 않도록 합니다.
  const fileType = type.split('/')[1];
  const albumName = `attachments/${moment().format('YYMMDD-HHmmss')}`;
  const fileName = name || file.slice(4, 14) + '.' + fileType;
  // const fileName = name || file.slice(4, 14) + '.' + 'jpg';

  const dir = albumName + '/';
  const key = dir + fileName;

  const imageFile = decode(file);

  return await s3
    .upload({
      Key: key,
      Body: imageFile,
      ContentType: type,
    })
    .promise();
};

export default {
  upload,
};
