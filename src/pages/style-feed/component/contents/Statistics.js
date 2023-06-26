import React from 'react';
import FastImage from 'react-native-fast-image';
import { Text } from '../../../../atoms/text';
import { Man, Woman } from '../../atoms/Icons';
import StatisticsStars from './StatisticStars';
import { Spacer } from '../../../../atoms/layout';
import styled from 'styled-components/native';
import COLOR from '../../../../../constants/COLOR';

const Statistics = (props) => {
  const { feed } = props;
  return (
    <Wrapper>
      <RowWrapper>
        <Row>
          <TextArea style={{ width: 43 }}>
            <FastImage
              style={{ width: 8, height: 22 }}
              source={Man}
            />
            <AverageText style={{ color: 'rgba(24, 156, 196,1)' }}>
              {feed?.ratings_average_men.toFixed(2) || '-'}
            </AverageText>
          </TextArea>
          <Spacer width={2} />
          <StatisticsStars
            feed={feed}
            gender={'male'}
            star={feed?.ratings_average_men}
          />
        </Row>
        <Spacer height={8} />
        <Row>
          <TextArea style={{ width: 43 }}>
            <FastImage
              style={{ width: 8, height: 22 }}
              source={Woman}
            />
            <AverageText style={{ color: 'rgba(247, 43, 86,1)' }}>
              {feed?.ratings_average_women.toFixed(2) || '-'}
            </AverageText>
          </TextArea>
          <Spacer width={2} />
          <StatisticsStars
            feed={feed}
            gender={'female'}
            star={feed?.ratings_average_women}
          />
        </Row>
      </RowWrapper>
      <RowWrapper>
        <Row>
          <TextArea style={{ width: 62 }}>
            <Text size={13}>10대</Text>
            <AverageText>{feed?.ratings_average_10?.toFixed(2) || '-'}</AverageText>
          </TextArea>
          <Spacer width={2} />
          <StatisticsStars
            feed={feed}
            gender={'none'}
            star={feed?.ratings_average_10 || 0}
          />
        </Row>
        <Spacer height={8} />
        <Row>
          <TextArea style={{ width: 62 }}>
            <Text size={13}>20대</Text>
            <AverageText>{feed?.ratings_average_20?.toFixed(2) || '-'}</AverageText>
          </TextArea>
          <Spacer width={2} />
          <StatisticsStars
            feed={feed}
            gender={'none'}
            star={feed?.ratings_average_20 || 0}
          />
        </Row>
      </RowWrapper>
    </Wrapper>
  );
};

const AverageText = styled.Text`
  width: 35px;
  text-align: center;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: -0.3px;
`;
const Row = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 22px;
`;
const TextArea = styled.View`
  padding-top: 1px;
  flex-direction: row;
  align-items: center;
`;
const Wrapper = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  margin-top: 22px;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-color: ${COLOR.BORDER};
  overflow: hidden;
`;
const RowWrapper = styled.View`
  flex: 1;
  padding-right: 10px;
`;

export default Statistics;
