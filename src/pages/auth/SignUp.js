import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { withContext } from 'context-q';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { logout as kakaoLogout } from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _, { debounce } from 'lodash';

import COLOR from '../../../constants/COLOR';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { NavHead } from '../../components/layouts';

import { Row, SpaceBetweenRow, Spacer } from '../../atoms/layout';
import { Text } from '../../atoms/text';
import { Checkbox, LabeledInput, Select } from '../../atoms/form';
import { Button } from '../../atoms/button';
import signUp from '../../net/auth/signUp';
import validateEmail from '../../utils/validateEmail';
import { getBodyList, getGenderList, getHeightList } from '../../utils/getMetaLists';
import signIn from '../../net/auth/signIn';
import setToken from '../../net/auth/setToken';
import checkIsNameAvailable from '../../utils/checkIsNameAvailable';
import editMyInfo from '../../net/user/editMyInfo';
import deleteToken from '../../net/auth/deleteToken';
import handleLoginType from '../../net/auth/handleLoginType';
import checkAvailableEmail from '../../net/auth/checkAvailableEmail';
import { getContext, initialAgreementList, initialData } from './sign-up';
import get from '../../net/core/get';
import { API_HOST } from '@env';
import { blocksAtom } from '../../stores';
import { useSetAtom } from 'jotai';

function SignUpPage(props) {
  const navigation = useNavigation();
  const [bodyTypes, setBodyTypes] = useState([]);
  const [heights, setHeights] = useState({ male: [], female: [] });
  const [genders, setGenders] = useState([]);

  const [agreeList, setAgreeList] = useState({
    useArg: false,
    privateInfo: false,
    age: false,
    push: false,
  });
  const [signUpData, setSignUpData] = useState(initialData);
  const [checkedAll, setCheckedAll] = useState(false);
  const [availableEmail, setAvailableEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const paramsData = useMemo(() => {
    const _params = props.route.params?.params;
    const { signUpType, gender, email, name, socialToken, socialType, userData } = _params;
    return {
      email,
      gender,
      name,
      signUpType, // normal, editInfo, social
      socialToken,
      socialType, // kakao, apple
      userData,
    };
  }, [props.route.params?.params]);

  useEffect(() => {
    (async function () {
      const bodyList = await getBodyList();
      setBodyTypes(bodyList);
      const genderList = await getGenderList();
      setGenders(genderList);
      const heightList = await getHeightList();
      setHeights(heightList);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      initData();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        initData();
      };
    }, [props.route.params]),
  );

  const initData = () => {
    const _params = props.route.params?.params;
    const isNormalType = _params?.signUpType === 'normal';

    const initialEmail = (!isNormalType && _params?.email) || '';
    const initialName = (!isNormalType !== 'normal' && _params?.name) || '';
    const initialGender = (!isNormalType !== 'normal' && _params?.gender) || '';

    setSignUpData({
      ...initialData,
      email: initialEmail,
      gender_id: initialGender,
      name: initialName,
    });
    setAvailableEmail(false);
  };

  const onBackPress = () => {
    Alert.alert('', '페이지에서 나가시겠습니까?', [
      {
        text: '나가기',
        style: 'cancel',
        onPress: async () => {
          await deleteToken();
          navigation.goBack();
          if (props.route.params?.params?.socialType === 'kakao') {
            const kakaoResult = await kakaoLogout();
          }
        },
      },
      { text: '머무르기', onPress: () => {} },
    ]);
    return true;
  };

  const checkValidate = async (signUpData, agreeList) => {
    try {
      const { signUpType, gender, email, name, socialToken, socialType, userData } = paramsData;
      const isSocialSignUp = signUpType === 'social';
      const isEditInfo = signUpType === 'editInfo';

      if (!signUpData.email) return Alert.alert('', '이메일을 입력해주세요');
      if (!email && !availableEmail) return Alert.alert('', '이메일 중복확인을 해주세요');
      if (!validateEmail(signUpData.email)) return Alert.alert('', '올바른 이메일 형식이 아닙니다.');
      if (!signUpData.name) return Alert.alert('', '닉네임을 입력해주세요');
      if (isEditInfo && name === signUpData.name) {
      } else {
        const isAvailableName = await checkIsNameAvailable(signUpData?.name);
        if (!isAvailableName) return Alert.alert('', '이미 존재하는 닉네임입니다');
      }
      if (signUpType === 'normal') {
        if (signUpData.password.length < 6) return Alert.alert('비밀번호', '6자 이상의 비밀번호를 입력해주세요.');
        if (!signUpData.password) return Alert.alert('', '비밀번호를 입력해주세요.');
        if (!signUpData.password_confirmation) return Alert.alert('', '비밀번호를 한번 더 입력해주세요.');
        if (signUpData.password !== signUpData.password_confirmation)
          return Alert.alert('', '비밀번호가 일치하지 않습니다.');
      }

      if (!signUpData.birth) return Alert.alert('', '생년월일을 입력해주세요.');
      const datetimeRegexp = /[0-9]{4}[0-9]{2}[0-9]{2}/;
      if (!datetimeRegexp.test(signUpData.birth)) {
        Alert.alert('', '생년월일은 yyyymmdd 형식으로 입력해주세요.');
        return false;
      }
      if (!moment(signUpData.birth)?.isValid()) {
        Alert.alert('', '생년월일이 올바른 날짜인지 확인해주세요.');
        return false;
      }
      const formattedBirth = moment(signUpData.birth).format('YYYY-MM-DD');
      if (moment().diff(formattedBirth, 'years') < 14) {
        Alert.alert('', '만 14세 미만 회원은 가입할 수 없습니다.');
        return false;
      }
      if (!signUpData.gender_id) return Alert.alert('', '성별을 선택해주세요.');
      if (!signUpData.body_type_id) return Alert.alert('', '체형을 선택해주세요.');
      if (!signUpData.height_id) return Alert.alert('', '키를 선택해주세요.');
      if (!agreeList.useArg) return Alert.alert('', '이용약관에 동의해주세요.');
      if (!agreeList.privateInfo) return Alert.alert('', '개인정보 처리방침 약관에 동의해주세요.');
      if (!agreeList.age) return Alert.alert('', '만 14세 이상 확인 항목에 동의해주세요.');

      return true;
    } catch (error) {
      throw error;
    }
  };
  const setBlocks = useSetAtom(blocksAtom);
  const postSignUp = _.throttle(
    async () => {
      setLoading(true);
      try {
        const { signUpType, gender, email, name, socialToken, socialType, userData } = paramsData;
        const isSocialSignUp = signUpType === 'social';
        const isEditInfo = signUpType === 'editInfo';

        const isValidate = await checkValidate(signUpData, agreeList);
        if (!checkValidate) {
          return false;
        }
        const formattedBirth = moment(signUpData.birth).format('YYYY-MM-DD');

        if (isValidate) {
          let formData = new FormData();
          formData.append('email', signUpData.email);
          if (!isSocialSignUp && !isEditInfo) {
            formData.append('password', signUpData.password);
            formData.append('password_confirmation', signUpData.password_confirmation);
          }
          formData.append('name', signUpData.name);
          formData.append('instagram', signUpData.instagram);
          formData.append('gender_id', signUpData.gender_id.toString());
          formData.append('height_id', signUpData.height_id.toString());
          formData.append('body_type_id', signUpData.body_type_id);
          formData.append('birth', formattedBirth);
          formData.append('allow_notification', signUpData.allow_notification || true);

          const token = paramsData.socialToken;
          if (isSocialSignUp) {
            await setToken(token);
            await setSignedEmail(signUpData.email);
            const editMyInfoResponse = await editMyInfo(formData);
            await postSocialSignIn();
          } else if (isEditInfo) {
            const [updateUserInfoResponse] = await editMyInfo(formData);
            await setToken(token);
            const [blocks] = await get(`${API_HOST}/v1/blocks`);
            setBlocks(blocks);

            await setSignedEmail(updateUserInfoResponse.email);
            props.context.update({
              user: updateUserInfoResponse,
              token: token,
            });
            navigation.navigate('Home');
          } else {
            await signUp(formData);
            await setSignedEmail(signUpData.email);
            await postSignIn();
          }
        }
      } catch (error) {
        const status = error?.response?.status || '';
        let msg = error.response.data?.[0].message || error.response.data.message;

        msg =
          signUpData.email +
          '로 회원가입을 처리할 수 없습니다.\n\n' +
          `- 에러 스크린샷과 함께 관리자에게 문의해주세요. \n\nhttps://pairing.kr/app-ask \n\n` +
          msg;

        console.warn(error.response.data);
        Alert.alert(
          getContext(paramsData.signUpType).navText + ' 실패: ' + status + ' ' + (error.response.data?.[0].field || ''),
          msg,
        );
      } finally {
        setLoading(false);
      }
    },
    500,
    {
      trailing: false,
    },
  );

  const postSocialSignIn = async () => {
    try {
      const token = paramsData.socialToken;
      const userData = paramsData.userData;

      props.context.update({
        ...props.context,
        user: userData,
        token: token,
      });

      await handleLoginType('set', props.route.params?.params?.socialType);
      navigation.navigate('Home');
    } catch (error) {
      console.warn('postSocialSignIn', error);
    }
  };

  const postSignIn = async () => {
    try {
      const params = {
        email: signUpData.email,
        password: signUpData.password,
      };
      const [data] = await signIn(params);

      const token = data?.token?.token;
      const userData = data?.user;

      await setToken(token);
      const [blocks] = await get(`${API_HOST}/v1/blocks`);
      setBlocks(blocks);

      props.context.update({
        ...props.context,
        user: userData,
        token,
      });

      await handleLoginType('set', 'email');

      navigation.navigate('Home');
    } catch (error) {
      console.warn('postSignIn', error);
    }
  };

  const setSignedEmail = async (email) => {
    try {
      AsyncStorage.setItem('signedId', email);
    } catch (error) {
      console.warn('setSignedEmail', error);
    }
  };

  const onPressCheckEmail = debounce(async (email) => {
    try {
      if (!validateEmail(signUpData.email)) return Alert.alert('', '올바른 이메일 형식이 아닙니다.');

      const [response] = await checkAvailableEmail(email);
      if (response.available) {
        setAvailableEmail(true);
        Alert.alert('', '사용가능한 이메일 입니다.');
      }
    } catch (e) {
      console.warn('onPressCheckEmail', e.response);
      let msg = e.response.data.message;
      let type = e.response.data.type?.toLowerCase();
      switch (type) {
        case 'kakao':
          type = '카카오';
          break;
        case 'apple':
          type = '애플';
          break;
        case 'ootd':
          type = '페어링';
          break;
        default:
          break;
      }
      if (msg === '이미 사용중인 이메일입니다.') {
        if (type === '카카오')
          msg = `사용할 수 없는 이메일 입니다.\n\n이 이메일은 기존에 카카오 회원으로 가입된 이력이 있습니다.\n\n카카오 로그인을 하시거나 다른 이메일로 가입을 시도해주세요.`;
        else if (type === '애플')
          msg = `사용할 수 없는 이메일 입니다.\n\n이 이메일은 기존에 애플 회원으로 가입된 이력이 있습니다.\n\n애플 로그인을 하시거나 다른 이메일로 가입을 시도해주세요.`;
        else
          msg = `사용할 수 없는 이메일 입니다.\n\n이 이메일은 기존에 ${type} 회원으로 가입된 이력이 있습니다.\n\n${type}(으)로 로그인을 하시거나 다른 이메일로 가입을 시도해주세요.`;
      }
      Alert.alert('', msg);
    }
  }, 300);

  return (
    <WhiteSafeArea>
      <NavHead
        title={getContext(paramsData.signUpType).navText}
        onLeftPress={onBackPress}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}>
        <Spacer height={20} />
        <Container>
          {/* Form */}
          <Row centered>
            <LabeledInput
              style={{ flex: 1 }}
              keyboardType={'email-address'}
              label={'이메일 주소'}
              placeholder={'이메일 주소를 입력해주세요'}
              value={signUpData.email}
              onChangeText={(text) => {
                setSignUpData({ ...signUpData, email: text });
                setAvailableEmail(false);
              }}
              disabled={paramsData.email}
              onBlur={() => {
                setSignUpData({
                  ...signUpData,
                  email: signUpData.email.split(' ').join(''),
                });
              }}
            />
            {!paramsData.email && (
              <>
                <Spacer width={10} />
                <Button
                  disabled={signUpData.email === '' || availableEmail}
                  buttonHeight={'32px'}
                  fontSize={14}
                  onPress={() => onPressCheckEmail(signUpData.email)}>
                  {availableEmail ? '확인완료' : '중복확인'}
                </Button>
              </>
            )}
          </Row>
          <LabeledInput
            label={'닉네임'}
            placeholder={'닉네임을 입력해주세요'}
            value={signUpData.name}
            onChangeText={(text) => setSignUpData({ ...signUpData, name: text })}
          />
          <LabeledInput
            label={'(선택) 인스타그램 연동'}
            placeholder={'인스타그램 아이디를 입력해주세요'}
            value={signUpData.instagram}
            onChangeText={(text) => setSignUpData({ ...signUpData, instagram: text })}
          />
          {paramsData.signUpType === 'normal' && (
            <>
              <LabeledInput
                label={'비밀번호'}
                placeholder={'6자 이상의 비밀번호를 입력해주세요'}
                secureTextEntry={true}
                value={signUpData.password}
                onChangeText={(text) => setSignUpData({ ...signUpData, password: text })}
              />
              <LabeledInput
                label={'비밀번호 확인'}
                placeholder={'비밀번호를 다시 입력해주세요'}
                secureTextEntry={true}
                value={signUpData.password_confirmation}
                onEndEditing={() => {
                  if (signUpData.password !== signUpData.password_confirmation)
                    Alert.alert('', '비밀번호가 일치하지 않습니다');
                }}
                onChangeText={(text) => setSignUpData({ ...signUpData, password_confirmation: text })}
              />
            </>
          )}
          <LabeledInput
            label={'생년월일'}
            keyboardType='numeric'
            placeholder={'ex) 19920101'}
            value={signUpData.birth}
            onChangeText={(text) => setSignUpData({ ...signUpData, birth: text })}
          />

          <Spacer size={10} />
          <Text
            color={'#00AFF0'}
            size={12}>
            체형에 관한 정보는 '나'를 위한 패션 데이터분석에만 사용되며, {'\n'}
            타인에게 보여지지 않습니다.
          </Text>
          <LabeledSelect
            placeholder={{
              label: '성별을 선택하세요',
              value: null,
              color: '#ccc',
            }}
            label={'성별'}
            value={signUpData.gender_id}
            onValueChange={(value) => {
              if (value === null) {
                setSignUpData({
                  ...signUpData,
                  height_id: null,
                  gender_id: value,
                });
              } else {
                setSignUpData({ ...signUpData, gender_id: value });
              }
            }}
            items={genders}
          />
          <LabeledSelect
            placeholder={{
              label: '체형을 선택하세요',
              value: null,
              color: '#ccc',
            }}
            label={'체형'}
            value={signUpData.body_type_id}
            onValueChange={(value) => setSignUpData({ ...signUpData, body_type_id: value })}
            items={bodyTypes}
          />
          <LabeledSelect
            placeholder={{
              label: signUpData.gender_id ? '키를 선택하세요' : '성별을 먼저 선택해주세요',
              value: null,
              color: '#ccc',
            }}
            label={'키'}
            value={signUpData.height_id}
            onValueChange={(value) => {
              setSignUpData({ ...signUpData, height_id: value });
            }}
            disabled={!signUpData.gender_id}
            items={signUpData?.gender_id?.toString() === '1' ? heights.male : heights.female}
          />

          <Spacer height={40} />

          <AgreementArea>
            <Row style={{ alignItems: 'center' }}>
              <Checkbox
                checked={checkedAll}
                setChecked={() => {
                  setCheckedAll(!checkedAll);
                  let arr = {};
                  if (!checkedAll) {
                    _.forOwn(agreeList, (value, key) => {
                      arr[key] = true;
                    });
                  } else {
                    _.forOwn(agreeList, (value, key) => {
                      arr[key] = false;
                    });
                  }
                  setAgreeList(arr);
                }}
              />
              <Spacer width={8} />
              <GrayText style={{ color: 'rgba(90,90,90,1)' }}>서비스 이용 약관 전체 동의</GrayText>
            </Row>
            <Spacer height={20} />
            {['useArg', 'privateInfo', 'age', 'push'].map((id, index) => (
              <View key={`${id}`}>
                <SpaceBetweenRow>
                  <Row style={{ alignItems: 'center', flex: 1 }}>
                    <Checkbox
                      checked={agreeList[id]}
                      setChecked={() => {
                        if (agreeList[id]) {
                          setCheckedAll(false);
                        }

                        setAgreeList({ ...agreeList, [id]: !agreeList[id] });
                      }}
                    />
                    <Spacer width={8} />
                    <GrayText>{initialAgreementList[id]?.title}</GrayText>
                  </Row>
                  {initialAgreementList[id]?.url && (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Policy', {
                          url: initialAgreementList[id]?.url,
                        });
                      }}>
                      <GrayText>보기</GrayText>
                    </TouchableOpacity>
                  )}
                  <Spacer width={20} />
                </SpaceBetweenRow>
                <Spacer height={10} />
              </View>
            ))}
          </AgreementArea>
          {/* /Form */}

          <Spacer height={22} />
          <Button
            onPress={postSignUp}
            disabled={loading}>
            {getContext(paramsData.signUpType).submitText}
          </Button>
          <Spacer height={23} />
        </Container>
      </ScrollView>
    </WhiteSafeArea>
  );
}

const LabeledSelect = (props) => {
  return (
    <LabeledSelectComponent>
      <Label style={{ width: 102, textAlign: 'center', paddingRight: 30 }}>{props.label}</Label>
      <Select {...props} />
    </LabeledSelectComponent>
  );
};

const Container = styled.View`
  padding-horizontal: 27px;
`;

const Label = styled.Text`
  font-size: 13px;
  color: rgba(168, 168, 168, 1);
`;

const LabeledSelectComponent = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 22px;
  margin-bottom: 22px;
  border-bottom-width: 1px;
  border-color: ${COLOR.BORDER};
`;

const AgreementArea = styled.View``;
const GrayText = styled(Text)`
  color: ${COLOR.GRAY};
  font-size: 14px;
`;

SignUpPage = withContext(SignUpPage);
export default SignUpPage;
