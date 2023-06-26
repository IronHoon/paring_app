import React from 'react';
import { SafeAreaView } from 'react-native';
import Postcode from 'react-native-daum-postcode';
import styled from 'styled-components';
import Modal from 'react-native-modal';

import { deviceWidth } from '../../../atoms/layout';
import { NavHead } from '../../../components/layouts';

function SearchAddress(props) {
  const { onClose, onChange } = props;
  return (
    <Modal
      isVisible={true}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0 }}
      onBackdropPress={onClose}>
      <SafeAreaView style={{ flex: 1 }}>
        <Wrapper>
          <NavHead
            title={'주소 검색'}
            onLeftPress={onClose}
          />
          <Postcode
            style={{ width: '100%', marginTop: 10 }}
            jsOptions={{ animated: true }}
            onSelected={(data) => {
              onChange(data);
              onClose();
            }}
          />
        </Wrapper>
      </SafeAreaView>
    </Modal>
  );
}

const Wrapper = styled.View`
  flex: 1;
  width: ${deviceWidth}px;
  background-color: #fff;
`;

export default SearchAddress;
