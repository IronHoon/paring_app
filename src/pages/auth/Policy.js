import React from 'react';
import { WebView } from 'react-native-webview';

import { NavHead, WhiteSafeArea } from '../../components/layouts';

const PolicyPage = ({ route }) => {
  const { url } = route.params;

  return (
    <WhiteSafeArea>
      <NavHead />

      <WebView source={{ uri: url }} />
    </WhiteSafeArea>
  );
};
export default PolicyPage;
