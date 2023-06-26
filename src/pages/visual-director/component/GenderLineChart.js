import React, { useState } from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
import { Grid, LineChart, XAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';

const GenderLineChart = ({ dataset }) => {
  const data = [
    {
      data: dataset.female.map?.((v, i) => (v === null ? 0 : v)),
      svg: { stroke: 'rgb(247,43,86)', strokeWidth: 3 },
    },
    {
      data: dataset.male.map?.((v, i) => (v === null ? 0 : v)),
      svg: { stroke: 'rgb(24,156,196)', strokeWidth: 3 },
    },
  ];

  let emptyData = [
    {
      data: [0, 0, 0, 0],
      svg: { stroke: 'rgb(247,43,86)', strokeWidth: 3 },
    },
    {
      data: [0, 0, 0, 0],
      svg: { stroke: 'rgb(24,156,196)', strokeWidth: 3 },
    },
  ];
  const label = ['3주전', '2주전', '1주전', '이번주'];

  const axesSvg = { fontSize: 10, fill: 'grey' };
  const verticalContentInset = { top: 0, bottom: 30, left: 30, right: 30 };
  const xAxisHeight = 30;

  const Labels = (props) => {
    const { data, x, y, width, height } = props;
    return data.map((dataset, datasetIndex) => {
      return dataset.data.map((value, index) => {
        const isWoman = datasetIndex === 0;
        const stringValue = parseFloat(value?.toFixed(2)).toString();
        const _x = x(index) - 2.5 * (stringValue.length + 1);
        const _y = value > 4 ? y(value) + 15 : y(value) - 15;
        return (
          <Text
            key={`${index}`}
            x={isWoman ? _x - 12 : _x + 12}
            y={_y}
            fontWeight={'bold'}
            fontSize='14'
            fill={dataset.svg.stroke}
            alignmentBaseline={'middle'}
            letterSpacing='-1'>
            {stringValue}
          </Text>
        );
      });
    });
  };

  const [chartData, setChartData] = useState(emptyData);
  React.useEffect(() => {
    setChartData(emptyData);
    setTimeout(() => {
      setChartData(data);
    }, 500);
  }, [dataset]);

  return (
    <>
      <View style={{ height: 200, flexDirection: 'row' }}>
        <YAxis>
          <YAxisItem>5</YAxisItem>
          <YAxisItem>4</YAxisItem>
          <YAxisItem>3</YAxisItem>
          <YAxisItem>2</YAxisItem>
          <YAxisItem>1</YAxisItem>
          <YAxisItem>0</YAxisItem>
        </YAxis>
        <View style={{ flex: 1 }}>
          <LineChart
            numberOfTicks={5}
            style={{ flex: 1 }}
            data={chartData}
            gridMin={0}
            gridMax={5}
            contentInset={verticalContentInset}
            animate>
            <Grid />
            <Labels />
          </LineChart>
        </View>
      </View>
      <XAxis
        style={{ marginLeft: 30, height: xAxisHeight }}
        data={dataset.female}
        formatLabel={(value, index) => {
          return label[index];
        }}
        contentInset={{ left: 30, right: 30 }}
        svg={axesSvg}
      />
    </>
  );
};

const YAxis = styled.View`
  width: 30px;
  margin-top: -8px;
  padding-bottom: 3px;
`;

const YAxisItem = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #888;
  font-weight: bold;
`;

export default GenderLineChart;
