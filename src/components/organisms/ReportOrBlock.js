import { Icon } from '../../atoms/image';
import { Alert, Pressable, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { useAtom } from 'jotai';
import { blocksAtom, reportAtom } from '../../stores';
import tw from 'twrnc';
import { CommonActions, useNavigation } from '@react-navigation/native';
import post from '../../net/core/post';
import { API_HOST } from '@env';

export function ReportOrBlock({ target_table, target_id, isMe }) {
  const navigation = useNavigation();
  const [report, setReport] = useAtom(reportAtom);
  const [showModal, setShowModal] = useState(false);
  const [blocks, setBlocks] = useAtom(blocksAtom);

  const block = useCallback(async () => {
    let target = '';
    let fix = '';
    switch (target_table) {
      case 'users':
        target = '사용자';
        fix = '를';
        break;
      case 'posts':
        target = '게시물';
        fix = '을';
        break;
      case 'comments':
        target = '댓글';
        fix = '을';
        break;
    }
    try {
      Alert.alert(`${target} 차단`, `이 ${target}${fix} 차단하시겠습니까?`, [
        {
          text: '취소',
        },
        {
          text: '차단',
          onPress: async () => {
            const [block] = await post(`${API_HOST}/v1/blocks`, {
              target_table: target_table,
              target_id: target_id,
            });
            setBlocks((prev) => [...prev, block]);
            setShowModal(false);
            Alert.alert('완료', '차단되었습니다.');
            navigation.dispatch((state) => {
              return CommonActions.reset({
                index: 0,
                actions: [navigation.navigate('Home')],
              });
            });
          },
        },
      ]);
    } catch (error) {
      console.warn(error);
    }
  }, [target_table, target_id]);

  useEffect(() => {
    return () => {
      setShowModal(false);
    };
  }, []);

  return (
    <>
      {!isMe && (
        <Pressable>
          <Icon
            source={require('../../../assets/moreIcon.png')}
            size={22}
            onPress={() => {
              setShowModal(true);
            }}
          />
        </Pressable>
      )}
      <Modal
        onBackdropPress={() => {
          setShowModal(false);
        }}
        isVisible={showModal}>
        <View style={tw`items-center`}>
          <Pressable
            style={tw`w-60 bg-white p-2 items-center border-b border-gray-300`}
            onPress={() => {
              setReport({
                target_table: target_table,
                target_id: target_id,
              });
              navigation.navigate('Reports');
            }}>
            <Text>신고하기</Text>
          </Pressable>
          <Pressable
            style={tw`w-60 bg-white p-2 items-center`}
            onPress={block}>
            <Text>차단하기</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}
