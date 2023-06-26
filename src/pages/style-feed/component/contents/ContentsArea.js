import React from 'react';
import { LayoutAnimation, Pressable, View } from 'react-native';
import { Text } from '../../../../atoms/text';
import SpaceBetweenView from '../../atoms/SpaceBetweenView';

const ContentsArea = (props) => {
  const { spread, setSpread, content } = props;
  const contentArray = content ? Array?.from?.(content) : [''];

  return (
    <SpaceBetweenView
      height={'auto'}
      isContent={true}>
      <View
        style={{
          width: spread ? '100%' : '80%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 60,
          paddingVertical: 20,
        }}>
        <Text
          multiline
          ellipsizeMode={spread ? 'tail' : 'tail'}
          style={{ width: '100%' }}>
          {spread ? (
            content
          ) : (
            <>
              {contentArray?.map((item, index) => {
                if (index < 50) return item;
              })}
            </>
          )}
        </Text>
        {!spread && content?.length > 50 && (
          <Pressable
            style={{ marginTop: 18, marginLeft: 20 }}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(200, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.scaleXY),
              );
              setSpread(true);
            }}>
            <Text
              size={14}
              style={{ color: 'rgba(124,124,124,1)' }}>
              더 보기
            </Text>
          </Pressable>
        )}
      </View>
    </SpaceBetweenView>
  );
};

export default ContentsArea;
