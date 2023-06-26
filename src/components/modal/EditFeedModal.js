import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components';

import ChallengeUpload from '../../pages/upload/component/ChallengeUpload';
import DailyUpload from '../../pages/upload/component/DailyUpload';
import { Spacer } from '../../atoms/layout';

import Modal from 'react-native-modal';
import { useFocusEffect } from '@react-navigation/native';

function EditFeedModal(props) {
  const { feed, todo, handleVisible, visible, route } = props;
  const [uploadType, setUploadType] = useState(props.feed?.type);
  const initialData = {
    feedImage: props.feed?.image || null,
    content: props.feed?.content || '',
    style: props.feed?.style_id || '',
    outer: props.feed?.outer_id || '',
    top: props.feed?.top_id || '',
    bottom: props.feed?.bottom_id || '',
  };
  const [feedData, setFeedData] = useState(initialData);

  const init = (params) => {
    setFeedData(initialData);
  };

  useFocusEffect(
    React.useCallback(() => {
      init();
      return () => {
        init();
        handleVisible(false);
      };
    }, [props.feed, route]),
  );

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={1}
      backdropColor={'rgb(220,220,220)'}
      style={{ flex: 1 }}
      // style={{ margin: 0}}
      onBackButtonPress={() => handleVisible(false)}>
      <SafeAreaView style={{ flex: 1 }}>
        <Content
          feed={feed}
          todo={todo}
          feedData={feedData}
          setFeedData={setFeedData}
          uploadType={uploadType}
          setUploadType={setUploadType}
          handleClose={() => {
            handleVisible(false);
          }}
          setIsVisible={handleVisible}
        />
      </SafeAreaView>
    </Modal>
  );
}

const Content = ({
  feed,
  todo,
  uploadType,
  setUploadType,
  feedData,
  setFeedData,
  handleClose,
  setIsVisible,
  ...props
}) => {
  return (
    <Wrapper>
      {!uploadType || uploadType === 'challenge' ? (
        <ChallengeUpload
          todo={todo || 'create'}
          feedId={feed?.id}
          uploadType={'challenge'}
          setUploadType={setUploadType}
          feedData={feedData}
          setFeedData={setFeedData}
          handleClose={handleClose}
          setIsVisible={setIsVisible}
        />
      ) : (
        <DailyUpload
          todo={todo || 'create'}
          feedId={feed?.id}
          uploadType={'daily'}
          setUploadType={setUploadType}
          feedData={feedData}
          setFeedData={setFeedData}
          handleClose={handleClose}
          setIsVisible={setIsVisible}
        />
      )}
      <Spacer height={19} />
      {/*{!uploadType || uploadType === 'challenge' ? (*/}
      {/*  <Pressable*/}
      {/*    onPress={() => {*/}
      {/*      setUploadType(UploadType.Daily);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <ClosedHeader title={'daily'} />*/}
      {/*  </Pressable>*/}
      {/*) : (*/}
      {/*  <Pressable*/}
      {/*    onPress={() => {*/}
      {/*      setUploadType(UploadType.Challenge);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <ClosedHeader title={'challenge'} />*/}
      {/*  </Pressable>*/}
      {/*)}*/}
    </Wrapper>
  );
};

const Wrapper = styled.View`
  flex: 1;
  padding-top: 20px;
  margin-bottom: -20px;
`;

export default EditFeedModal;
