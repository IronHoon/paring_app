import React from 'react';
import ConnectsTitle from './ConnectsTitle';
import { Icon } from '../../../atoms/image';
import { Spacer } from '../../../atoms/layout';
import SwiperRow from './SwiperRow';

const ConnectsArea = (props) => {
  const { userData, connectData, myId } = props;
  return (
    <>
      <ConnectsTitle
        userData={userData}
        latterText={' 님과의 페어링'}
        titleIcon={
          <Icon
            source={require('../../../../assets/iconLogoBlack.png')}
            size={18}
          />
        }
      />
      <Spacer height={13} />
      <ConnectsTitle
        textType={'sub'}
        userData={userData}
        latterText={'님이 좋아할 만한 나의 룩'}
      />
      <Spacer height={11} />
      <SwiperRow
        noDataText={'아직 업로드 하신 스타일이 없어요'}
        myId={myId}
        postsData={connectData.myLook || []}
      />
      <Spacer height={35} />
      <ConnectsTitle
        textType={'sub'}
        userData={userData}
        formerText={'내가 입었을 때 '}
        latterText={'님이 좋아할만한 룩 추천'}
      />
      <Spacer height={11} />
      <SwiperRow
        myId={myId}
        postsData={connectData.otherLook || []}
      />
      <Spacer height={20} />
    </>
  );
};

export default ConnectsArea;
