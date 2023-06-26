import React, { Fragment } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components';
import Modal from 'react-native-modal';
import { Text } from '../text';

const TabModal = (props) => {
  const { visible, setVisible, onClose } = props;
  const TabModalItems = () => {
    if (props.children?.map) {
      return props.children?.map?.((v, i) => (
        <Fragment key={i.toString()}>{React.cloneElement(v, { setVisible: setVisible })}</Fragment>
      ));
    } else {
      return <>{React.cloneElement(props.children, { setVisible: setVisible })}</>;
    }
  };
  return (
    <Modal isVisible={visible}>
      <Pressable
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onPress={() => {
          onClose ? onClose() : setVisible(false);
        }}>
        <TabModalItems />
      </Pressable>
    </Modal>
  );
};

TabModal.Item = (props) => {
  return (
    <TabModalItem
      {...props}
      onPress={(e) => {
        e.stopPropagation();
        props.onPress?.();

        props.setVisible?.(false);
      }}>
      {props.label ? <Text size={15}>{props.label}</Text> : props.children}
    </TabModalItem>
  );
};

const TabModalItem = styled.Pressable`
  width: 220px;
  padding-vertical: 8px;
  padding-horizontal: 22px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: rgb(220, 220, 220);
`;

export const Item = TabModal.Item;
export default TabModal;
