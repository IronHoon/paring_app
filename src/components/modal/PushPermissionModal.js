import React from 'react';
import SimpleModal from '../../atoms/modal/SimpleModal';
import { Text } from '../../atoms/text';
import Spacer from '../../atoms/layout/Spacer';
import { Row } from '../../atoms/layout';
import { Button } from '../../atoms/button';
import { requestUserPermission } from '../../net/auth/requestUserPermission';

const PushPermissionModal = ({ visible, setVisible }) => {
  const closePermissionModal = () => {
    setVisible(false);
  };
  const onPressAccept = async () => {
    await requestUserPermission();
    closePermissionModal();
  };

  return (
    <SimpleModal
      width={'380px'}
      visible={visible}
      setVisible={() => {}}
      onBackdropPress={() => {}}>
      <Text
        size={13}
        color={'rgb(168,168,168)'}>
        기기 알림 권한 확인
      </Text>
      <Spacer size={18} />
      <Text size={13}>
        기기의 알림 권한을 허용해 주시겠어요?{`\n\n\n`}- 내 패션이 랭킹에 올랐을때 알림을 받을 수 있어요!{`\n\n`}- 내
        사진에 댓글이 달렸을 때 알림을 받을 수 있어요! {`\n\n`}- 여러가지 알림을 받을 수 있어요!
      </Text>
      <Spacer size={20} />
      <Row style={{ justifyContent: 'flex-end' }}>
        {/*<Button backgroundColor={'#fff'} fontColor={'rgb(64,64,64)'} onPress={onPressDeny}>*/}
        {/*  취소*/}
        {/*</Button>*/}
        {/*<Spacer width={10} />*/}
        <Button
          backgroundColor={'#fff'}
          fontColor={'rgb(0,175,240)'}
          bold
          onPress={onPressAccept}>
          확인
        </Button>
      </Row>
    </SimpleModal>
  );
};

export default PushPermissionModal;
