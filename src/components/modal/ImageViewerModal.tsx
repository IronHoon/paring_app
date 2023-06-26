import { Dimensions, Pressable, SafeAreaView, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon } from '../../atoms/image';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  item: any;
};

export function ImageViewerModal({ isVisible, onClose, item }: Props) {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top;

  return (
    <Modal
      isVisible={isVisible}
      style={{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        margin: 0,
      }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <FastImage
            source={{ uri: item.image }}
            resizeMode={FastImage.resizeMode.contain}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
        <Pressable
          onPress={onClose}
          style={{
            height: 40,
            position: 'absolute',
            top: topOffset,
            left: 9,
            justifyContent: 'center',
            width: '100%',
          }}>
          <Icon
            source={require('../../../assets/white_arrow.png')}
            size={30}
            onPress={onClose}
            onPressIn={undefined}
          />
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}
