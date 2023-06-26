import React from 'react';
import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';

import COLOR from '../../../constants/COLOR';
import { Spacer } from '../../atoms/layout';
import { Icon } from '../../atoms/image';
import { View } from 'react-native';

const NavHead = ({
  title,
  right,
  children,
  onLeftPress,
  left,
  hasBorder = false,
  hide = false,
  textAlignLeft = false,
  select = false,
  back = true,
  ...props
}) => {
  const navigation = useNavigation();

  return (
    <Container
      hasBorder={hasBorder}
      hide={hide}>
      <View style={{ minWidth: 30 }}>
        {left ||
          ((navigation.canGoBack() || onLeftPress) && back && (
            <Icon
              source={require('../../../assets/back_new.png')}
              size={15}
              onPress={() => {
                onLeftPress ? onLeftPress() : navigation.goBack();
              }}
            />
          ))}
      </View>
      <Spacer width={19} />
      <CenterArea textAlignLeft={textAlignLeft}>
        {children}
        {title && <HeaderText select>{title}</HeaderText>}
      </CenterArea>
      <Spacer width={19} />
      <View style={{ minWidth: 30 }}>{right}</View>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  border-color: ${COLOR.BORDER};
  padding-horizontal: 13px;
  background-color: #fff;

  ${({ hasBorder }) => (hasBorder ? `border-bottom-width: 1px;` : ``)};
`;

const CenterArea = styled.View`
  flex-direction: row;
  align-items: center;

  ${({ textAlignLeft }) => (textAlignLeft ? `flex:1;` : ``)};
`;

const HeaderText = styled.Text`
  font-size: ${(props) => (props.select ? '19px' : '17px')};
  font-weight: ${(props) => (props.select ? 'bold' : 'normal')};
  letter-spacing: -0.42px;
`;

export default NavHead;
