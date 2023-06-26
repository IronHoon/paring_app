import React from 'react';
import styled from 'styled-components/native';
import { Spacer } from '../../../atoms/layout';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 17px;
`;

const TitleText = styled.Text`
  font-size: 13px;
  color: ${(props) => (props.textType === 'sub' ? 'rgb(74,74,74)' : 'rgb(0,0,0)')};
`;

const NameText = styled(TitleText)`
  max-width: 110px;
  color: ${(props) => (props.textType === 'sub' ? 'rgb(74,74,74)' : 'rgb(0,0,0)')};
`;

const ConnectsTitle = (props) => {
  const { titleIcon, userData, formerText, latterText, textType } = props;

  return (
    <Wrapper>
      {titleIcon ? titleIcon : <Spacer width={5} />}
      {formerText && (
        <TitleText
          textType={textType}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {formerText}
        </TitleText>
      )}
      <NameText
        textType={textType}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {userData?.name}
      </NameText>
      {latterText && (
        <TitleText
          textType={textType}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {latterText}
        </TitleText>
      )}
    </Wrapper>
  );
};

export default ConnectsTitle;
