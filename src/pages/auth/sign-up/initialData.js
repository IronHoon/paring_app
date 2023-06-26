export const initialAgreementList = {
  useArg: {
    title: '(필수) 이용약관 동의',
    url: 'https://pairing.kr/app-service/',
    agree: false,
  },
  privateInfo: {
    title: '(필수) 개인정보 처리방침 동의',
    url: 'https://pairing.kr/app-private/',
    agree: false,
  },
  age: {
    title: '(필수) 만 14세 이상 입니다.',
    agree: false,
  },
  push: {
    title: '(선택) 마케팅 수신 동의',
    agree: false,
  },
};

export const initialData = {
  email: '',
  password: '',
  password_confirmation: '',
  name: '',
  instagram: '',
  gender_id: '',
  height_id: '',
  body_type_id: '',
  birth: '',
  allow_notification: true,
};

export const getContext = (signUpType) => {
  let ctx;
  const context = {
    normal: {
      navText: '회원가입',
      submitText: '가입하기',
    },
    social: {
      navText: '소셜 회원정보 업데이트',
      submitText: '수정하기',
    },
    editInfo: {
      navText: '회원정보 업데이트',
      submitText: '수정하기',
    },
  };
  if (signUpType === 'social') {
    ctx = context['social'];
  } else if (signUpType === 'editInfo') {
    ctx = context['editInfo'];
  } else {
    ctx = context['normal'];
  }

  return ctx;
};
