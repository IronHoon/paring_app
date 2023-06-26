import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import styled from 'styled-components';

import SimpleModal from '../../atoms/modal/SimpleModal';
import { NavHead } from '../layouts';

const Modal = styled(SimpleModal)``;
const HeaderContainer = styled.View`
  height: 44px;
`;
const Content = styled.View`
  flex: 1;
  padding: 0 20px;
`;
const ContentText = styled.Text`
  padding: 10px 0 20px;
  color: #7a7a7a;
  font-size: 15px;
  line-height: 24px;
`;

const AgreementModal = ({ type, visible, onClose }) => {
  return (
    <Modal
      full
      visible={visible}
      setVisible={() => {}}
      onBackButtonPress={onClose}>
      <HeaderContainer>
        <NavHead
          title={agreementTypes[type]?.name}
          onLeftPress={onClose}
        />
      </HeaderContainer>
      <Content>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <Pressable>
            <ContentText>{agreementTypes[type]?.content}</ContentText>
          </Pressable>
        </ScrollView>
      </Content>
    </Modal>
  );
};
const agreementTypes = {
  payment: {
    name: '상품구매조건 및 취소 / 환불 규정',
    content: `1. 상품구매 조건 동의
주문 상품의 상품명, 가격, 배송정보, 할인내역을 확인하였으며 이에 동의합니다.

2. 취소환불 규정 동의
[반품/교환 가능 기간]
– 반품/교환 신청은 배송완료 당일부터 7일이내에 가능합니다. (단, 상품의 불량, 오배송, 배송중 분실, 고장, 오염 등 소비자의 과실이 아닌 경우 7일 이후에도 신청 가능)
– 미사용 상품에 한해서만 반품/교환이 가능합니다.

[휴대폰 결제]
-페어링에서 휴대폰으로 결제 가능한 최대 금액은 월 30만원이며 개인별 한도금액은 통신사 및 개인설정에 따라 다를 수 있습니다.
-휴대폰으로 결제하신 금액은 익월 휴대폰 요금에 함께 청구되며 별도의 수수료는 부과되지 않습니다.
-휴대폰 결제시 부분취소는 불가하며 전체취소만 가능합니다.
-휴대폰 경제의 경우 당월은 결제 취소만 가능합니다.
-익월 이후 휴대폰결제 환불 건은 입금 확인 후 결제자 본인 계좌로만 환불 가능합니다.

[반품/교환 배송비]
– 상품 판매 업체마다 반품/교환 배송비는 상이할 수 있습니다.
– 제주 / 도서산간 지역은 추가 비용이 발생할 수 있습니다.
– 반품비용 : 결제 비용에서 차감 후 환불됩니다.
– 교환비용 : 교환요청 상품에 동봉 또는 상품 판매업체로 입금이 필요합니다.
– 주문 제작 상품들은 단순 변심에 의한 환불/교환이 어려우니 구매전 상품페이지를 꼭 확인해주세요.
– 여러 개의 박스로 나누어 발송된 경우 박스 당 반품/교환 배송비가 부과될 수 있습니다.
– 판매 업체가 사용하지 않은 택배사로 반송할 경우 추가비용이 발생할 수 있습니다.
– 모니터 해상도 차이로 인하여 색상 등 이미지가 실제와 상이한 경우로 반품/교환 신청시 비용이 발생할 수 있습니다.
– 판매자 귀책 사유가 아닐 경우, 추가 비용이 발생할 수 있습니다.

[반품/교환 불가 사유 안내]
– 반품/교환 요청 가능 기간이 초과된 경우 (배송완료 당일부터 7일 초과시)
– 교환을 요청했으나 재고가 부족한 경우 환불 처리 될 수 있습니다.
구매자의 사용 또는 상품 수령 후 소비자의 과실로 상품의 가치가 감소한 경우
· 주문/제작 상품의 제작이 이미 진행된 경우
– 1+1 상품의 부분 반품의 경우 (전체 반품처리만 가능)
– 최초 구성품, 사은품 등의 사용 또는 누락 및 상품 택, 보증서, 상품 부자재 등이 제거/분실된 경우
– 정당한 사유로 반품/교환 요청을 하였으나 판매자와 협의가 되지 않는경우 페어링고객센터로 문의 해 주세요.

3. 기타
(주)페어링은 통신판매중개자로서 통신판매 당사자가 아니며 입점판매자가 등록한 상품, 거래 정보 및 거래에 대하여 (주)페어링은 일체의 책임을 지지 않습니다. 소비자 보호와 안전거래를 위해 고객센터를운영하고 있으며, 관련 분쟁이 발생할 경우 별도의 분쟁 처리 절차에 의거 분쟁이 처리됩니다.`,
  },
  personalInformation: {
    name: '개인정보 제 3자 제공 동의',
    content: `개인정보 제공 받는자 : 상품 판매자

개인 정보 이용목적 : 배송,교환,환불,고객상담 등

제공 항목 : 주문자 이이디, 주문자 닉네임, 주문자 이름, 주문자 이메일, 주문자 연락처, 수령인 이름, 수령인 연락처, 배송지, 입금자명

보유 및 이용기간 : 대금 결제 및 재화 공급 기록 5년, 고객 상담 등에 관한 기록 3년`,
  },
};

export default AgreementModal;
