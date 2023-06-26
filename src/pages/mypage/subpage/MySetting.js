import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { withContext } from 'context-q';
import _ from 'lodash';

import { Row, Spacer } from '../../../atoms/layout';
import { Spinner } from '../../../atoms/image';
import { Text } from '../../../atoms/text';
import { LabeledInput, Select } from '../../../atoms/form';
import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import { NavHead } from '../../../components/layouts';
import COLOR from '../../../../constants/COLOR';
import editMyInfo from '../../../net/user/editMyInfo';
import getMyInfo from '../../../net/user/getMyInfo';
import { getBodyList, getGenderList, getHeightList } from '../../../utils/getMetaLists';
import checkIsNameAvailable from '../../../utils/checkIsNameAvailable';
import { useFirebase } from '../../../utils/useFirebase';
import { useAuth, usePersistentState } from '../../../hooks';
import ChangePhoto from '../component/ChangePhoto';
import { CompanyInfo } from '../component/CompanyInfo';
import tw from 'twrnc';

function MySettingPage(props) {
  const originalName = props?.context?.user?.name;
  const navigation = useNavigation();
  const auth = useAuth();

  const [bodyTypes, setBodyTypes] = useState([]); // select list
  const [heights, setHeights] = useState({ male: [], female: [] }); // select list
  const [genders, setGenders] = useState([]); // select list
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleUserData = (v) => {
    setUserData(v);
  };

  useFocusEffect(
    useCallback(() => {
      getInitialData(); //get initial my info
    }, [props.route?.params, props.context?.user]),
  );

  const getInitialData = async () => {
    setLoading(true);
    try {
      updateSelectList(); //get initial select list
      const [data] = await getMyInfo();
      let _birth = !data?.birth || data?.birth === '0000-00-00' ? '' : data?.birth;
      if (_birth !== '' && _birth.split('T').length > 1) {
        _birth = moment(_birth)?.format('YYYY-MM-DD');
      }
      setUserData({
        ...data,
        avatar: data?.avatar || '',
        name: data?.name || '',
        instagram: !data?.instagram || data?.instagram === 'null' ? '' : data?.instagram,
        gender_id: data?.gender_id || '',
        height_id: data?.height_id || '',
        body_type_id: data?.body_type_id || '',
        allow_notification: data?.allow_notification || '',
        birth: _birth ? moment(_birth).format('YYYYMMDD') : '',
      });
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSelectList = async () => {
    const bodyList = await getBodyList();
    setBodyTypes(bodyList);
    const genderList = await getGenderList();
    setGenders(genderList);
    const heightList = await getHeightList();
    setHeights(heightList);
  };

  const showWithdrawAlert = () => {
    Alert.alert(
      '탈퇴',
      '회원탈퇴를 신청하시면 즉시 탈퇴가 완료되어 계정 복구가 불가능합니다. 정말로 탈퇴하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          onPress: async () => {
            await auth.withdraw();
            props.context.update({
              user: null,
              token: null,
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  const checkValidate = async (userData) => {
    try {
      if (!userData.name) return Alert.alert('', '닉네임을 입력해주세요');
      if (originalName !== userData?.name) {
        const isAvailableName = await checkIsNameAvailable(userData?.name);
        if (!isAvailableName) return Alert.alert('', '이미 존재하는 닉네임입니다');
      }
      if (!userData.birth) return Alert.alert('', '생년월일을 입력해주세요.');
      const datetimeRegexp = /[0-9]{4}[0-9]{2}[0-9]{2}/;
      if (!datetimeRegexp.test(userData.birth)) {
        Alert.alert('', '생년월일은 yyyymmdd 형식으로 입력해주세요.');
        return false;
      }
      if (!moment(userData.birth)?.isValid()) {
        Alert.alert('', '생년월일이 올바른 날짜인지 확인해주세요.');
        return false;
      }
      const formattedBirth = moment(userData.birth).format('YYYY-MM-DD');
      if (moment().diff(formattedBirth, 'years') < 14) {
        Alert.alert('', '생년월일을 만 14세 미만으로 설정할 수 없습니다.');
        return false;
      }
      if (!userData.gender_id) return Alert.alert('', '성별을 선택해주세요.');
      if (!userData.height_id) return Alert.alert('', '키를 선택해주세요.');
      if (!userData.body_type_id) return Alert.alert('', '체형을 선택해주세요.');

      return true;
    } catch (error) {
      throw error;
    }
  };
  const updateUserInfo = _.debounce(
    React.useCallback(async () => {
      setLoading(true);
      try {
        const isValidate = await checkValidate(userData);
        if (!isValidate) {
          return false;
        }
        const formattedBirth = moment(userData.birth).format('YYYY-MM-DD');
        const params = {
          avatar: userData.avatar,
          name: userData.name,
          instagram: userData.instagram,
          gender_id: userData.gender_id,
          height_id: userData.height_id,
          body_type_id: userData.body_type_id,
          birth: formattedBirth,
          allow_notification: userData.allow_notification,
        };
        let formData = new FormData();
        formData.append('avatar', params.avatar);
        formData.append('name', params.name);
        formData.append('instagram', params.instagram);
        formData.append('gender_id', params.gender_id.toString());
        formData.append('height_id', params.height_id.toString());
        formData.append('body_type_id', params.body_type_id);
        formData.append('birth', params.birth);
        formData.append('allow_notification', params.allow_notification);

        const [updateUserInfoResponse] = await editMyInfo(formData);

        props.context.update({
          ...props.context,
          user: updateUserInfoResponse,
        });

        if (params.allow_notification === true) {
          await useFirebase().updateToken();
        }

        Alert.alert('내 정보 수정', '수정되었습니다.');
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    }, [userData]),
    500,
  );

  const [, setMypage] = usePersistentState('posts_mypage');
  const [, setOotd] = usePersistentState('posts_ootd');
  const [, setChallenge] = usePersistentState('posts_challenge');
  const [, setDaily] = usePersistentState('posts_daily');

  const initialValue = {
    data: [],
    page: 1,
    lastPage: 1,
  };
  const logout = async () => {
    try {
      await auth.logout();
      setMypage(initialValue);
      setOotd(initialValue);
      setChallenge(initialValue);
      setDaily(initialValue);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <WhiteSafeArea>
      <NavHead />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}>
        {loading ? (
          <Container>
            <Spinner />
          </Container>
        ) : (
          <>
            <Container>
              <Top>
                <ChangePhoto
                  userData={userData}
                  setUserData={handleUserData}
                />
                <Spacer height={18} />
                <Text size={20}>프로필 사진 변경</Text>
              </Top>

              {/* Form */}
              <LabeledInput
                label={'닉네임 변경'}
                placeholder={'닉네임을 입력해주세요'}
                value={userData?.name}
                maxLength={16}
                onChangeText={(text) => handleUserData({ ...userData, name: text })}
              />
              <LabeledInput
                label={'인스타그램 연동'}
                placeholder={'인스타그램 아이디를 입력해주세요'}
                value={userData?.instagram}
                onChangeText={(text) => handleUserData({ ...userData, instagram: text })}
              />
              <LabeledInput
                keyboardType='numeric'
                label={'생년월일'}
                placeholder={'ex) 19920101'}
                value={userData?.birth}
                onChangeText={(text) => handleUserData({ ...userData, birth: text })}
              />

              <Spacer size={10} />
              <View style={tw`items-center`}>
                <Pressable
                  style={tw`bg-black rounded py-1 px-4`}
                  onPress={() => {
                    navigation.navigate('AccountInfo');
                  }}>
                  <Text style={tw`text-white`}>정산 계좌 등록/수정하기</Text>
                </Pressable>
              </View>
              <Spacer size={20} />
              <Text
                color={'rgba(168, 168, 168, 1)'}
                size={13}>
                체형에 관한 정보는 '나'를 위한 패션 데이터분석에만 사용되며, {'\n'}타인에게 보여지지 않습니다.
              </Text>
              <LabeledSelect
                placeholder={{
                  label: '체형을 선택하세요',
                  value: null,
                  color: '#ccc',
                }}
                label={'체 형'}
                value={userData?.body_type_id}
                onValueChange={(value) => {
                  handleUserData({ ...userData, body_type_id: value });
                }}
                items={bodyTypes}
              />
              <LabeledSelect
                placeholder={{
                  label: '성별을 선택하세요',
                  value: null,
                  color: '#ccc',
                }}
                label={'성 별'}
                value={userData?.gender_id}
                onValueChange={(value) => {
                  if (!loading) {
                    if (value === null) {
                      handleUserData({
                        ...userData,
                        height_id: null,
                        gender_id: value,
                      });
                    } else {
                      handleUserData({ ...userData, gender_id: value });
                    }
                  }
                }}
                items={genders}
              />
              <LabeledSelect
                placeholder={{
                  label: userData?.gender_id ? '키를 선택하세요' : '성별을 먼저 선택해주세요',
                  value: null,
                  color: '#ccc',
                }}
                label={'키'}
                value={userData?.height_id}
                onValueChange={(value) => {
                  handleUserData({ ...userData, height_id: value });
                }}
                disabled={!userData?.gender_id}
                items={userData?.gender_id?.toString() === '1' ? heights.male : heights.female}
              />

              <LabeledSelect
                placeholder={{}}
                label={'알림'}
                value={userData?.allow_notification || false}
                onValueChange={(value) => {
                  handleUserData({ ...userData, allow_notification: value });
                }}
                items={[
                  { label: '받기', value: true },
                  { label: '받지 않기', value: false },
                ]}
              />

              <Row style={{ justifyContent: 'flex-end' }}>
                <TouchableOpacity
                  onPress={updateUserInfo}
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
                  <Text
                    size={17}
                    style={{ color: 'rgb(0,175,240)' }}>
                    수정
                  </Text>
                </TouchableOpacity>
              </Row>

              <Bottom>
                {props.context?.user.type !== 'Kakao' && props.context?.user.type !== 'Apple' && (
                  <>
                    <Pressable
                      hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                      onPress={() => {
                        navigation.navigate('ChangePassword');
                      }}>
                      <BottomButtonText>비밀번호 변경</BottomButtonText>
                    </Pressable>
                    <Spacer height={20} />
                  </>
                )}
                <Pressable
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  onPress={async () => await logout()}>
                  <BottomButtonText>로그아웃</BottomButtonText>
                </Pressable>
                <Spacer height={20} />
                <Pressable
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  onPress={showWithdrawAlert}>
                  <BottomButtonText>탈퇴하기</BottomButtonText>
                </Pressable>
                <Spacer height={30} />
              </Bottom>
            </Container>
            <CompanyInfo />
          </>
        )}
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

const Top = styled.View`
  align-items: center;
  margin-bottom: 53px;
`;
const Container = styled.View`
  padding-horizontal: 27px;
`;

const Label = styled.Text`
  font-size: 13px;
  color: rgba(168, 168, 168, 1);
`;
const Bottom = styled.View`
  margin-top: 57px;
`;
const BottomButtonText = styled.Text`
  padding-horizontal: 9px;
  font-size: 15px;
  color: #818181;
`;
const LabeledSelectComponent = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 22px;
  margin-bottom: 22px;
  border-bottom-width: 1px;
  border-color: ${COLOR.BORDER};
`;

MySettingPage = withContext(MySettingPage);
export default MySettingPage;
