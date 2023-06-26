import React from 'react';
import styled from 'styled-components';

import { Text as TextBase } from '../../../atoms/text';
import { Row } from '../../../atoms/layout';

const Component = styled.View`
  margin-top: 30px;
  padding: 18px;
  background-color: #eee;
`;
const Container = styled.View`
  padding-horizontal: 17px;
`;
const Text = styled(TextBase)`
  color: #555;
`;

export const CompanyInfo = ({}) => {
  return (
    <Component>
      <Container>
        <Row>
          <Text>주식회사 페어링 | </Text>
          <Text>사업자등록번호 : 173-88-01678 | </Text>
        </Row>
        <Row>
          <Text>대표 : 김명곤 | </Text>
          <Text>개인정보관리책임자 : 염지원 |</Text>
        </Row>
        <Row>
          <Text>주소 :서초구 서초3동 명달로8길 11 801호 | </Text>
        </Row>
        <Row>
          <Text>고객센터 : 02-473-4102</Text>
        </Row>
      </Container>
    </Component>
  );
};
