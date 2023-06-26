import React from 'react';
import getBodyTypes from '../net/meta/getBodyTypes';
import getGenders from '../net/meta/getGenders';
import getHeights from '../net/meta/getHeights';
import getStyles from '../net/meta/getStyles';
import getOuters from '../net/meta/getOuters';
import getTops from '../net/meta/getTops';
import getBottoms from '../net/meta/getBottoms';

const getBodyList = async () => {
  let bodyRows = [];

  const [data] = await getBodyTypes();
  data?.forEach((item) => {
    bodyRows.push({ label: item.name, value: item.id });
    return '';
  });

  return bodyRows;
};

const getGenderList = async () => {
  let genderRows = [];

  const [data] = await getGenders();
  data?.forEach((item) => {
    genderRows.push({ label: item.name, value: item.id });
    return '';
  });
  return genderRows;
};

const getHeightList = async () => {
  let heights = {
    male: [],
    female: [],
  };

  const [data] = await getHeights();
  data?.forEach((item) => {
    const gender = item.code.split('_')[0];
    if (gender === 'M') {
      heights.male.push({ label: item.name, value: item.id });
    } else {
      heights.female.push({ label: item.name, value: item.id });
    }
  });

  return heights;
};

const getStyleList = async () => {
  let styleRows = [];

  const [data] = await getStyles();
  data?.forEach((item) => {
    styleRows.push({ label: item.name, value: item.id });
    return '';
  });

  return styleRows;
};

const getOuterList = async () => {
  let outerRows = [];

  const [data] = await getOuters();
  data?.forEach((item) => {
    outerRows.push({ label: item.name, value: item.id });
    return '';
  });

  return outerRows;
};

const getTopList = async () => {
  let topRows = [];

  const [data] = await getTops();
  data?.forEach((item) => {
    topRows.push({ label: item.name, value: item.id });
    return '';
  });

  return topRows;
};

const getBottomList = async () => {
  let bottomRows = [];

  const [data] = await getBottoms();
  data?.forEach((item) => {
    bottomRows.push({ label: item.name, value: item.id });
    return '';
  });

  return bottomRows;
};

export { getBodyList, getGenderList, getHeightList, getStyleList, getOuterList, getTopList, getBottomList };
