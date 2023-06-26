import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Spinner = ({ style = {} }) => {
  return (
    <View style={[styles.container, styles.horizontal, style]}>
      <ActivityIndicator
        size='large'
        color='#00AFF0'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Spinner;
