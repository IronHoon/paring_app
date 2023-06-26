import { NavHead, WhiteSafeArea } from '../../components/layouts';
import { FlatList, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { useContextQ } from 'context-q';
import { useFocusEffect } from '@react-navigation/native';
import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../components/layouts/SwrContainer';
import { getRelationalTime } from '../../utils';
import { useCallback, useEffect, useMemo } from 'react';
import { ProfileImage } from '../../atoms/image';
import { navigate } from '../../navigators/RootNavigation';
import { When } from 'react-if';
import FastImage from 'react-native-fast-image';
import { ChatListHeader } from '../../components/organisms';
import messaging from '@react-native-firebase/messaging';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../stores';
import COLOR from '../../../constants/COLOR';
import { Spacer } from '../../atoms/layout';

export function ChatRoomList() {
  const { data, error, mutate } = useFetch<any>(`${API_HOST}/v1/chat-rooms`);
  const blocks = useAtomValue(blocksAtom);

  const blockUsers = useMemo(() => {
    return blocks.filter((block: any) => block.target_table === 'users').map((block: any) => block.target_id);
  }, [blocks]);
  useFocusEffect(
    useCallback(() => {
      mutate();
    }, []),
  );
  useEffect(() => {
    return messaging().onMessage(async () => {
      await mutate();
    });
  }, []);

  return (
    <WhiteSafeArea>
      <NavHead
        title={undefined}
        right={undefined}
        onLeftPress={undefined}
        left={undefined}>
        <Text style={tw`text-black font-bold text-lg`}>메세지</Text>
      </NavHead>
      <ChatListHeader active={'메세지'} />
      <SwrContainer
        data={data}
        error={error}>
        <>
          {data &&
          data.data.filter((room: any) => !blockUsers.includes(room.from_id) && !blockUsers.includes(room.to_id))
            .length > 0 ? (
            <FlatList
              data={data.data.filter(
                (room: any) => !blockUsers.includes(room.from_id) && !blockUsers.includes(room.to_id),
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ChatRoom chatRoom={item} />}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, color: '#e4e4e4', fontWeight: '700' }}>채팅 메세지가 없어요</Text>
            </View>
          )}
        </>
      </SwrContainer>
    </WhiteSafeArea>
  );
}

function ChatRoom({ chatRoom }: any) {
  const context = useContextQ();
  const interlocutors = useMemo(() => {
    if (chatRoom) {
      return context.user.id === chatRoom.from_id ? chatRoom.to : chatRoom.from;
    }
    return {};
  }, [chatRoom]);
  const unreadCount = useMemo(() => {
    return chatRoom.__meta__.unread;
  }, [chatRoom]);

  const lastMessage = useMemo(() => {
    const additional_info = JSON.parse(chatRoom.additional_info);
    if (additional_info) {
      const last_message = JSON.parse(additional_info.last_message);
      switch (last_message.type) {
        case 'text':
          return last_message.data;
        case 'image':
          return '[사진]';
        case 'video':
          return '[동영상]';
        case 'file':
          return '[파일]';
      }
    }
    return '';
  }, [chatRoom]);

  return (
    <Pressable
      style={[tw`flex-row border-b border-gray-300 py-3 px-4 items-center`, { height: 80 }]}
      onPress={() => {
        navigate('ChatRoom', { id: chatRoom.id });
      }}>
      <View style={tw`mr-2`}>
        <ProfileImage
          source={interlocutors.avatar}
          onPress={undefined}
          size={40}
        />
      </View>
      <View style={[tw`flex-1`]}>
        <View style={[tw`flex-row items-end`]}>
          <Text style={tw`font-bold text-black mr-2`}>{interlocutors.name}</Text>
          <Text style={[tw``, { fontSize: 13, color: 'rgba(165,165,165,1)' }]}>
            {getRelationalTime(chatRoom.updated_at)}
          </Text>
        </View>
        <Spacer height={3} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[{ fontSize: 13 }, tw`text-black`]}>{lastMessage}</Text>
        </View>
      </View>
      <When condition={chatRoom.merchandise}>
        {chatRoom.merchandise?.images.split(',').map((item: any, index: number) => {
          if (index === 0)
            return (
              <FastImage
                source={{ uri: item }}
                style={tw`w-15 h-15 rounded`}
              />
            );
        })}
      </When>
      <When condition={chatRoom.post}>
        <FastImage
          source={{ uri: chatRoom.post?.image }}
          style={tw`w-15 h-15 rounded`}
        />
      </When>
      {/*<When condition={!chatRoom.post}>*/}
      {/*  <View style={tw`w-15 h-15 rounded`} />*/}
      {/*</When>*/}

      {unreadCount > 0 && (
        <View
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            right: 8,
            backgroundColor: COLOR.PRIMARY,
            top: 5,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
}
