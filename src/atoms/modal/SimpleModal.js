import React from 'react';
import styled from 'styled-components';
import Modal from 'react-native-modal';

import { deviceHeight, deviceWidth } from '../layout';

const SimpleModal = ({ children, full, title, width, visible, setVisible, onBackdropPress, ...props }) => {
  return (
    <>
      {visible && (
        <StyledModal
          propagateSwipe
          isVisible={visible}
          onBackdropPress={() => {
            onBackdropPress?.() || setVisible(false);
          }}
          {...props}>
          <Inner
            full={full}
            onPress={(e) => {
              e.stopPropagation();
            }}>
            <Container
              width={width}
              full={full}>
              <Wrapper>
                {title && <Title>{title}</Title>}
                {children}
              </Wrapper>
            </Container>
          </Inner>
        </StyledModal>
      )}
    </>
  );
};

const StyledModal = styled(Modal)`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: ${parseInt(deviceHeight, 10)}px;
  margin: 0;
  padding: 0;
`;
const Wrapper = styled.SafeAreaView``;
const Inner = styled.Pressable`
  align-self: center;
  ${({ full }) =>
    full
      ? `
    flex: 1;
    width: ${deviceWidth}px;
    height: ${parseInt(deviceHeight, 10)}px;
  `
      : ``}
`;
const Container = styled.View`
  width: ${({ width }) => (width ? `${width}` : '300px')};
  padding: 20px;
  background-color: #fff;
  max-width: 90%;

  ${({ full }) =>
    full
      ? `
    flex:1;
    padding: 0;
    width: ${deviceWidth}px;
    height: ${parseInt(deviceHeight, 10)}px;
    max-width: ${deviceWidth};
  `
      : ``}
`;

const Title = styled.Text`
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

export default SimpleModal;
