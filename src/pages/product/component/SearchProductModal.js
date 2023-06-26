import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import { Text } from '../../../atoms/text';
import { Spacer } from '../../../atoms/layout';
import UploadSelect from '../../upload/component/UploadSelect';
import Modal from 'react-native-modal';
import { useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components';

const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 28px;
`;
const ButtonClose = styled.Pressable`
  position: absolute;
  left: 0;
  right: 0;
`;

const Container = styled.View`
  width: 100%;
  height: 80%;
  padding: 19px;
  background-color: #fff;
  border-radius: 10px;
`;
const InputContainer = styled.View``;

const SearchProductModal = (props) => {
  const route = useRoute();
  const navigation = useNavigation();

  const { visibleModal, styleList, handleSearchFilter, handleSearchModal } = props;

  const [searchCategory1, setSearchCategory1] = useState(null);
  const [searchCategory2, setSearchCategory2] = useState(null);

  const handleClose = () => {
    if (navigation.canGoBack()) {
      handleSearchModal(false);
    } else {
      navigation.navigate('Home', { screen: 'Home' });
    }
    return true;
  };
  const handleCloseModal = () => {
    handleSearchModal(false);
  };

  useEffect(() => {
    setSearchCategory2(null);
  }, [searchCategory1]);

  const onPressSubmit = async () => {
    if (!searchCategory1 || searchCategory1?.length <= 0) {
      Alert.alert('', '카테고리를 선택해주세요.');
    } else if (!searchCategory2 || searchCategory2?.length <= 0) {
      Alert.alert('', '2차 카테고리를 선택해주세요.');
    } else {
      handleSearchFilter({
        category1: searchCategory1,
        category2: searchCategory2,
      });
      handleCloseModal(false);
    }
  };

  return (
    <Modal
      isVisible={visibleModal}
      backdropOpacity={0.9}
      backdropColor={'rgb(220,220,220)'}
      style={{ flex: 1 }}
      onBackButtonPress={handleClose}
      onBackdropPress={handleCloseModal}>
      <Container>
        <Header>
          <ButtonClose
            hitSlop={{ top: 50, left: 50, bottom: 50, right: 50 }}
            onPress={() => {
              handleCloseModal();
            }}>
            <Image
              style={{ width: 15, height: 15 }}
              source={require('../../../../assets/close.png')}
            />
          </ButtonClose>
          <Text size={17}>상품 검색</Text>
          <View />
        </Header>

        <Spacer height={30} />
        <InputContainer>
          <UploadSelect
            placeholder={{ label: '선택해주세요', value: null }}
            label={'카테고리'}
            value={searchCategory1 || null}
            onValueChange={(value) => {
              setSearchCategory1(value);
            }}
            items={[
              { label: '아우터', value: 'outer' },
              { label: '상의', value: 'top' },
              { label: '하의', value: 'bottom' },
              { label: '스타일', value: 'style' },
            ]}
          />

          {searchCategory1 === 'style' && (
            <UploadSelect
              placeholder={{ label: '전 체', value: null }}
              items={styleList.style || null}
              label={'스타일'}
              value={searchCategory2}
              onValueChange={(value) => setSearchCategory2(value)}
            />
          )}
          {searchCategory1 === 'outer' && (
            <UploadSelect
              placeholder={{ label: '전 체', value: null }}
              items={styleList.outer || null}
              label={'아우터'}
              value={searchCategory2}
              onValueChange={(value) => setSearchCategory2(value)}
            />
          )}
          {searchCategory1 === 'top' && (
            <UploadSelect
              placeholder={{ label: '전 체', value: null }}
              items={styleList.top || null}
              label={'상 의'}
              value={searchCategory2}
              onValueChange={(value) => setSearchCategory2(value)}
            />
          )}
          {searchCategory1 === 'bottom' && (
            <UploadSelect
              placeholder={{ label: '전 체', value: null }}
              items={styleList.bottom || null}
              label={'하 의'}
              value={searchCategory2}
              onValueChange={(value) => setSearchCategory2(value)}
            />
          )}
        </InputContainer>

        <Spacer height={17} />
        <Pressable
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
          onPress={onPressSubmit}>
          <Text size={17}>검색하기</Text>
        </Pressable>
      </Container>
    </Modal>
  );
};

export default SearchProductModal;
