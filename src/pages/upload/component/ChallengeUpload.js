import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components';
import { Spacer } from '../../../atoms/layout';
import OpenHeader from './OpenHeader';
import ImageArea from './ImageArea';
import FormArea from './FormArea';

const ChallengeUpload = (props) => {
  const { feedId, todo, uploadType, setUploadType, feedData, setFeedData, handleClose, setIsVisible } = props;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <OpenHeader
          todo={todo}
          feedId={feedId}
          uploadType={'challenge'}
          setUploadType={setUploadType}
          title={uploadType}
          feedData={feedData}
          setFeedData={setFeedData}
          handleClose={handleClose}
          setIsVisible={setIsVisible}
        />
        <Spacer height={20} />
        <ImageArea
          feedData={feedData}
          setFeedData={setFeedData}
        />
        <Spacer height={20} />
        <FormArea
          feedData={feedData}
          setFeedData={setFeedData}
        />
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
`;

export default ChallengeUpload;
