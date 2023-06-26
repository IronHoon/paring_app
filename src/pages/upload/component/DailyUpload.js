import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components';
import OpenHeader from './OpenHeader';
import { Spacer } from '../../../atoms/layout';
import ImageArea from './ImageArea';
import FormArea from './FormArea';
import DescriptionArea from './DescriptionArea';

const DailyUpload = (props) => {
  const { feedId, todo, uploadType, setUploadType, feedData, setFeedData, handleClose } = props;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <OpenHeader
          todo={todo}
          feedId={feedId}
          uploadType={'daily'}
          setUploadType={setUploadType}
          title={'Daily'}
          feedData={feedData}
          setFeedData={setFeedData}
          handleClose={handleClose}
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
        <DescriptionArea uploadType={uploadType} />
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

export default DailyUpload;
