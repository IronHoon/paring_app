import React from 'react';
import { Text } from '../../../atoms/text';
import COLOR from '../../../../constants/COLOR';
import { useFocusEffect } from '@react-navigation/native';

const Indices = (props) => {
  const [figure, setFigure] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      let p = 0;

      const timer = setInterval(() => {
        p += 1;

        setFigure((x) => Math.ceil(x + (props.index - x) * 0.006));
        if (p === 50) {
          setFigure(props.index);
          clearInterval(timer);
        }
      }, 10);
      return () => clearInterval(timer);
    }, [props.index]),
  );

  return (
    <>
      <Text
        size={19}
        style={{ color: COLOR.BLUE }}>
        {figure}%
      </Text>
    </>
  );
};

export default Indices;
