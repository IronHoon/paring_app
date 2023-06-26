import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../atoms/text';
import { Spacer } from '../../../atoms/layout';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import ThumbnailComponent from './RankingThumbnailComponent';

const StyleRankRow = (props) => {
  const { data, activeTab, title, thumbSize, thumbMargin } = props;
  return (
    <View>
      {title && (
        <>
          <Text size={13}>{title}</Text>
          <Spacer height={8} />
        </>
      )}
      <InnerWrapper activeTab={activeTab}>
        {data &&
          data?.length > 0 &&
          data?.map((item, index) => {
            return (
              <ThumbnailComponent
                key={index?.toString()}
                index={index}
                item={item}
                thumbSize={thumbSize}
                thumbMargin={thumbMargin}
                moveToStyleFeed={props.moveToStyleFeed}
                activeTab={activeTab}
              />
            );
          })}
      </InnerWrapper>
      <Spacer height={15} />
    </View>
  );
};

const InnerWrapper = styled.View`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;
export default StyleRankRow;
