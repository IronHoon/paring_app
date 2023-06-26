import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type SwrContainerProps<T> = {
  error?: any;
  data: T;
  loadingIndicator?: React.ReactNode;
  errorView?: React.ReactNode;
  children?: React.ReactElement;
};

function DefaultError({ error }: any) {
  if (__DEV__) {
    // console.warn(error);
    return <Text>Error : {JSON.stringify(error)}</Text>;
  } else {
    return <></>;
  }
}

function DefaultIndicator() {
  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator
        size='small'
        color='#0000ff'
      />
    </View>
  );
}

const SwrContainer = ({ error, data, loadingIndicator, errorView, children }: SwrContainerProps<any>) => {
  if (error) return errorView ? <>{errorView}</> : <DefaultError error={error} />;
  if (!data) return loadingIndicator ? <>{loadingIndicator}</> : <DefaultIndicator />;
  return <>{children}</>;
};

export default SwrContainer;
