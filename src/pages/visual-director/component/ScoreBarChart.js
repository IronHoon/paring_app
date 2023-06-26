import React, { useState } from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
import { BarChart } from 'react-native-svg-charts';

const ScoreBarChart = ({ data, biggestDataIndex }) => {
  const fill = '#5BDEED';
  const maxFill = '#00AFF0';

  let emptyDataset = data.map((value, index) => ({ value: 0, svg: { fill: fill } }));

  const [chartData, setChartData] = useState(emptyDataset);

  React.useEffect(() => {
    setChartData(emptyDataset);
    setTimeout(() => {
      let dataset = data.map((value, index) => ({
        value: value,
        svg: {
          fill: biggestDataIndex.includes(index) ? maxFill : fill,
        },
      }));
      setChartData(dataset);
    }, 50);
  }, [data]);

  return (
    <View>
      <BarChart
        style={{ height: 130 }}
        data={chartData}
        svg={{ fill }}
        contentInset={{ top: 28, bottom: 6 }}
        yAccessor={({ item }) => item.value}
        height={130}
        animate
      />
      <Labels>
        <LabelItem />
        <LabelItem>1</LabelItem>
        <LabelItem />
        <LabelItem>2</LabelItem>
        <LabelItem />
        <LabelItem>3</LabelItem>
        <LabelItem />
        <LabelItem>4</LabelItem>
        <LabelItem />
        <LabelItem>5</LabelItem>
      </Labels>
    </View>
  );
};

const Labels = styled.View`
  flex-direction: row;
`;

const LabelItem = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #888;
  font-weight: bold;
`;

export default ScoreBarChart;
