import React, { useCallback, useState } from 'react';
import { BackHandler, Pressable, SafeAreaView, Text, View } from 'react-native';

import ChallengeUpload from './component/ChallengeUpload';
import DailyUpload from './component/DailyUpload';

import Modal from 'react-native-modal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Case, Switch } from 'react-if';
import MerchandiseUpload from './component/MerchandiseUpload';
import { useSetAtom } from 'jotai';
import { merchandiseItemAtom } from '../../stores';
import { MerchandiseCategory, MerchandiseDescription } from './component';
import { UploadType } from '../../types';

function UploadPage(props: any) {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  // const [uploadType, setUploadType] = useState(props.route?.params?.feed?.type);
  const initialData = {
    feedImage: props.route?.params?.feed?.image || null,
    content: props.route?.params?.feed?.content || '',
    style: props.route?.params?.feed?.style_id || -1,
    outer: props.route?.params?.feed?.outer_id || -1,
    top: props.route?.params?.feed?.top_id || -1,
    bottom: props.route?.params?.feed?.bottom_id || -1,
  };
  const [feedData, setFeedData] = useState(initialData);
  const setMerchandiseItem = useSetAtom(merchandiseItemAtom);
  const [uploadType, setUploadType] = useState<UploadType>(UploadType.Challenge);

  const init = (params?: any) => {
    setFeedData(initialData);
  };

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      init(props.route?.params);
      setMerchandiseItem(
        props.route?.params?.todo === 'edit'
          ? {
              ...props.route?.params?.merchandise,
              images: props.route?.params?.merchandise.images.split(','),
            }
          : {},
      );
      setUploadType(props.route?.params?.merchandise ? UploadType.Merchandise : UploadType.Challenge);
      return () => {
        setIsVisible(false);
        init();
      };
    }, [props.route]),
  );

  const handleClose = () => {
    if (!navigation.canGoBack()) {
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
    return true;
  };
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleClose);
      return () => BackHandler.removeEventListener('hardwareBackPress', handleClose);
    }, []),
  );

  return (
    <View style={tw`flex-1`}>
      <Modal
        isVisible={isVisible || false}
        backdropOpacity={1}
        backdropColor={'rgb(220,220,220)'}
        style={{ flex: 1 }}
        onBackButtonPress={handleClose}>
        <SafeAreaView style={{ flex: 1 }}>
          <Switch>
            <Case condition={uploadType === UploadType.Challenge}>
              <ChallengeUpload
                todo={props.route.params?.todo || 'create'}
                feedId={props.route.params?.feed?.id}
                uploadType={'challenge'}
                setUploadType={setUploadType}
                feedData={feedData}
                setFeedData={setFeedData}
                handleClose={handleClose}
                setIsVisible={setIsVisible}
              />
            </Case>
            <Case condition={uploadType === UploadType.Daily}>
              <DailyUpload
                todo={props.route.params?.todo || 'create'}
                feedId={props.route.params?.feed?.id}
                uploadType={'daily'}
                setUploadType={setUploadType}
                feedData={feedData}
                setFeedData={setFeedData}
                handleClose={handleClose}
                setIsVisible={setIsVisible}
              />
            </Case>
            <Case condition={uploadType === UploadType.Merchandise}>
              <MerchandiseUpload
                todo={props.route.params?.todo || 'create'}
                setUploadType={setUploadType}
                handleClose={handleClose}
              />
            </Case>
            <Case condition={uploadType === UploadType.MerchandiseCategory}>
              <MerchandiseCategory setUploadType={setUploadType} />
            </Case>
            <Case condition={uploadType === UploadType.MerchandiseDescription}>
              <MerchandiseDescription setUploadType={setUploadType} />
            </Case>
          </Switch>

          {/* 업로드 페이지 하단 푸터 영역 */}
          <View style={tw`flex-row py-4 rounded-lg mt-4 bg-white justify-between`}>
            <Pressable
              style={tw`justify-center items-center flex-1`}
              onPress={() => setUploadType(UploadType.Challenge)}>
              <Text style={tw`${uploadType === UploadType.Challenge ? 'font-bold text-black' : 'text-gray-400'}`}>
                데일리룩
              </Text>
            </Pressable>
            {/*<Pressable*/}
            {/*  style={tw`justify-center items-center flex-1`}*/}
            {/*  onPress={() => setUploadType(UploadType.Daily)}>*/}
            {/*  <Text*/}
            {/*    style={tw`${*/}
            {/*      uploadType === UploadType.Daily*/}
            {/*        ? 'font-bold'*/}
            {/*        : 'text-gray-400'*/}
            {/*    }`}>*/}
            {/*    Like*/}
            {/*  </Text>*/}
            {/*</Pressable>*/}
            <Pressable
              style={tw`justify-center items-center flex-1`}
              onPress={() => setUploadType(UploadType.Merchandise)}>
              <Text style={tw`${uploadType === UploadType.Merchandise ? 'font-bold text-black' : 'text-gray-400'}`}>
                상품 등록
              </Text>
            </Pressable>
          </View>
          {/* 끝 : 업로드 페이지 하단 푸터 영역 */}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default UploadPage;
