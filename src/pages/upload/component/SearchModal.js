import React from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import { Text } from '../../../atoms/text';
import { Spacer } from '../../../atoms/layout';
import UploadSelect from './UploadSelect';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

const SearchModal = (props) => {
  const navigation = useNavigation();
  const { category, visibleModal, handleSearchModal, searchFilter, setSearchFilter, setSearching, filter = {} } = props;

  React.useEffect(() => {
    if (category) {
      setSearching(true);
      setSearchFilter({
        style: category?.style_id || null,
        gender: null,
        body: null,
        height: null,
        outer: category?.outer_id || null,
        top: category?.top_id || null,
        bottom: category?.bottom_id || null,
      });
    }
  }, [category]);

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

  const checkIsEmpty = () => {
    let isEmpty = true;
    Object.entries(searchFilter).map((props) => {
      if (props[1] !== null) isEmpty = false;
    });
    return isEmpty;
  };

  return (
    <Modal
      isVisible={visibleModal}
      backdropOpacity={0.9}
      backdropColor={'rgb(220,220,220)'}
      style={{ flex: 1 }}
      onBackButtonPress={handleClose}
      onBackdropPress={handleCloseModal}>
      <View style={{ width: '100%', height: '80%', padding: 19, backgroundColor: '#fff', borderRadius: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable
            hitSlop={{ top: 50, left: 50, bottom: 50, right: 50 }}
            onPress={() => {
              handleCloseModal();
            }}>
            <Image
              style={{ width: 15, height: 15 }}
              source={require('../../../../assets/close.png')}
            />
          </Pressable>
          <Text size={17}>검 색</Text>
          <View />
        </View>

        <Spacer height={50} />

        <View>
          <UploadSelect
            placeholder={{ label: '전 체', value: null }}
            label={'스타일'}
            value={searchFilter?.style}
            onValueChange={(value) => setSearchFilter({ ...searchFilter, style: value })}
            items={filter.styles}
          />
          <UploadSelect
            placeholder={{ label: '전 체', value: null }}
            label={'성 별'}
            value={searchFilter?.gender}
            onValueChange={(value) => setSearchFilter({ ...searchFilter, gender: value })}
            items={filter.genders}
          />
          <UploadSelect
            placeholder={{ label: '전 체', value: null }}
            label={'체 형'}
            value={searchFilter?.body}
            onValueChange={(value) => setSearchFilter({ ...searchFilter, body: value })}
            items={filter.bodyTypes}
          />
          <UploadSelect
            placeholder={{ label: searchFilter.gender ? '전체' : '성별을 먼저 선택해주세요', value: null }}
            label={'키'}
            value={searchFilter?.height}
            onValueChange={(value) => setSearchFilter({ ...searchFilter, height: value })}
            items={searchFilter?.gender?.toString() === '1' ? filter.heights?.male : filter.heights?.female}
            disabled={!searchFilter.gender}
          />
          <UploadSelect
            placeholder={{ label: '전 체', value: null }}
            label={'아우터'}
            value={searchFilter?.outer}
            onValueChange={(value) => setSearchFilter({ ...searchFilter, outer: value })}
            items={filter.outers}
          />
          <UploadSelect
            placeholder={{ label: '전 체', value: null }}
            label={'상 의'}
            value={searchFilter?.top}
            onValueChange={(value) => setSearchFilter({ ...searchFilter, top: value })}
            items={filter.tops}
          />
          <UploadSelect
            placeholder={{ label: '전 체', value: null }}
            label={'하 의'}
            value={searchFilter?.bottom}
            onValueChange={(value) => setSearchFilter({ ...searchFilter, bottom: value })}
            items={filter.bottoms}
          />
        </View>
        <Spacer height={17} />
        <Pressable
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
          onPress={async () => {
            if (checkIsEmpty()) {
              Alert.alert('', '하나 이상의 조건을 선택해주세요.');
            } else {
              handleCloseModal(false);
              setSearching(true);
            }
          }}>
          <Text size={17}>검색하기</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default SearchModal;
