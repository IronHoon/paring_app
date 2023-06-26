import React from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
`;

const TitleText = styled.Text`
  font-size: ${(props) => (props.fontSize ? props.fontSize : '10px')};
  color: rgba(136, 136, 136, 1);
  font-weight: bold;
  line-height: 13px;
  letter-spacing: -0.5px;
`;

const SubTitleArea = (props) => {
  return (
    <Wrapper>
      <TitleText fontSize={props.fontSize}>{props.subTitle}</TitleText>
    </Wrapper>
  );
};

export default SubTitleArea;
