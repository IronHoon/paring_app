import { WhiteSafeArea } from '../../components/layouts';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../components/layouts/SwrContainer';
import axios from 'axios';
import tw from 'twrnc';
import { useContextQ } from 'context-q';
import { Icon, ProfileImage } from '../../atoms/image';
import FastImage from 'react-native-fast-image';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { Case, Else, If, Switch, Then } from 'react-if';
import { useReloadUnreadCount } from '../../hooks/useReloadUnreadCount';
import post from '../../net/core/post';
import { ReportOrBlock } from '../../components/organisms';
import COLOR from '../../../constants/COLOR';
import { getResizePath, uploadImages } from '../../utils';

const formatter = new Intl.NumberFormat('ko-KR');

const options = {
  includeBase64: true,
  mediaTypes: 'photo',
  title: 'Select Image',
  maxWidth: 2000,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const { StatusBarManager } = NativeModules;

export function ChatRoom({ route }: any) {
  const context = useContextQ();
  const navigation = useNavigation();
  const id = route?.params?.id;
  const { data, error } = useFetch<any>(`${API_HOST}/v1/chat-rooms/${id}`);
  const { data: messages, error: messagesError, mutate } = useFetch<any>(`${API_HOST}/v1/chat-rooms/${id}/messages`);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 대화 상대
  const interlocutors = useMemo(() => {
    if (data) {
      return context.user.id === data.from_id ? data.to : data.from;
    }
    return {};
  }, [data]);
  // 인앱 메시지 수신시 알림
  useEffect(() => {
    return messaging().onMessage(async () => {
      await mutate();
    });
  }, []);

  // 데이터가 읽어지고 나면 안 읽은 메시지 다시 로드
  const reloadUnreadCount = useReloadUnreadCount();
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      if (messages && isFocused) {
        await post(`${API_HOST}/v1/chat-rooms/${id}/messages/read`);
        await reloadUnreadCount();
      }
    })();
  }, [messages, isFocused]);

  const convertToDateString = (date: string) => {
    return date.slice(0, 4) + '년 ' + date.slice(5, 7) + '월 ' + date.slice(8, 10) + '일';
  };

  const convertToTimeString = (date: string) => {
    let day;
    let hour;
    if (parseInt(date.slice(0, 2)) >= 12) {
      day = '오후';
      if (parseInt(date.slice(0, 2)) === 12) {
        hour = 12;
      } else {
        hour = (parseInt(date.slice(0, 2)) - 12).toString();
      }
    } else {
      day = '오전';
      hour = parseInt(date.slice(0, 2)).toString();
    }
    let minute = date.slice(3, 5);

    return day + ' ' + hour + ':' + minute;
  };

  // 사용자가 푸시를 허용했는지 여부를 체크
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const enabled = await messaging().hasPermission();
        setIsPushEnabled(!!enabled);
      })();
    }, []),
  );

  // ios 에서 status bar height 감지

  useEffect(() => {
    Platform.OS == 'ios'
      ? StatusBarManager.getHeight((statusBarFrameData: { height: SetStateAction<number> }) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  const [statusBarHeight, setStatusBarHeight] = useState(0);

  return (
    <WhiteSafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={statusBarHeight + 44}
        style={[{ flex: 1 }]}>
        <SwrContainer
          data={data}
          error={error}>
          <>
            <View
              style={[
                tw`flex-row items-center justify-between border-b border-gray-300 z-100`,
                { paddingHorizontal: 13, paddingVertical: 7 },
              ]}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`mr-2`}>
                  <Icon
                    source={require('../../../assets/back.png')}
                    size={23}
                    onPress={() => {
                      navigation.goBack();
                      Keyboard.dismiss();
                    }}
                    onPressIn={undefined}
                  />
                </View>

                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() =>
                    navigation.navigate('OthersProfile', {
                      screen: 'OthersProfile',
                      params: { userId: interlocutors.id },
                    })
                  }>
                  <ProfileImage
                    source={interlocutors.avatar}
                    onPress={() => {
                      navigation.navigate('OthersProfile', {
                        screen: 'OthersProfile',
                        params: { userId: interlocutors.id },
                      });
                    }}
                  />
                  <Text style={tw`ml-2 text-black`}>{interlocutors.name}</Text>
                </Pressable>
              </View>
              <ReportOrBlock
                target_table={'users'}
                target_id={interlocutors.id}
                isMe={undefined}
              />
            </View>
            {data && data.merchandise && (
              <Pressable
                style={tw`flex-row items-center p-2 border-b border-gray-300`}
                onPress={() => {
                  navigation.navigate('MerchandiseDetailPage', {
                    id: data.merchandise.id,
                  });
                }}>
                <FastImage
                  source={{ uri: data.merchandise.images.split(',').shift() }}
                  style={[tw`w-15 h-15 rounded mr-2`, {}]}
                />
                <View>
                  <Text style={tw`text-black font-bold`}>{data.merchandise.brand}</Text>
                  <Text style={tw`text-black text-xs`}>{data.merchandise.name}</Text>
                  <Text style={tw`text-black font-bold`}>{formatter.format(data.merchandise.price)}원</Text>
                </View>
              </Pressable>
            )}
            {data && data.post && (
              <Pressable
                style={tw`flex-row p-2 border-b border-gray-300`}
                onPress={() => {
                  navigation.navigate('SinglePostDetail', {
                    screen: 'SinglePostDetail',
                    params: {
                      feedId: data.post.id,
                    },
                  });
                }}>
                <FastImage
                  source={{ uri: data.post.image }}
                  style={tw`w-15 h-15 rounded`}
                />
                <View style={tw`flex-1 justify-center items-center`}>
                  <Text style={tw`text-xs text-gray-500`}>이 데일리룩의 착장상품에 대해 구매를 문의해보세요</Text>
                </View>
              </Pressable>
            )}

            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <>
                <SwrContainer
                  data={messages}
                  error={messagesError}>
                  {messages && (
                    <View style={tw`p-2 flex-1`}>
                      <FlatList
                        data={messages.data}
                        inverted={true}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => {
                          const message = JSON.parse(item.message);
                          let newDate = false;
                          if (index < messages.data.length - 1) {
                            if (item.created_at.slice(0, 10) !== messages.data[index + 1].created_at.slice(0, 10)) {
                              newDate = true;
                            }
                          } else if (index === messages.data.length - 1) {
                            newDate = true;
                          }
                          return (
                            <>
                              <View
                                style={tw`${
                                  item.sender_id === context.user.id ? 'flex-row-reverse' : 'flex-row'
                                } items-center mb-2`}>
                                <ProfileImage
                                  source={
                                    item.sender_id === context.user.id ? context.user.avatar : interlocutors.avatar
                                  }
                                  size={30}
                                  onPress={undefined}
                                />
                                <View
                                  style={tw`${
                                    item.sender_id === context.user.id ? 'flex-row-reverse' : 'flex-row'
                                  } items-end`}>
                                  <View
                                    style={tw`max-w-70 px-4 py-1 text-black mx-2 rounded-lg
                      ${
                        item.sender_id === context.user.id
                          ? 'border border-gray-300 rounded-br-none'
                          : 'bg-gray-200 rounded-bl-none border-gray-200'
                      }
                      `}>
                                    <Switch>
                                      <Case condition={message.type === 'text'}>
                                        <Text style={tw`text-black`}>{JSON.parse(item.message).data}</Text>
                                      </Case>
                                      <Case condition={message.type === 'image'}>
                                        <Pressable
                                          onPress={() => {
                                            navigation.navigate('ImageViewer', {
                                              uri: message.data,
                                            });
                                          }}>
                                          <FastImage
                                            source={{
                                              uri: getResizePath(message.data, 160, 160),
                                            }}
                                            style={tw`w-40 h-40`}
                                          />
                                        </Pressable>
                                      </Case>
                                    </Switch>
                                  </View>
                                  <Text style={[tw`text-xs`, { fontSize: 11, color: COLOR.GRAY }]}>
                                    {/*{getRelationalTime(item.created_at)}*/}
                                    {convertToTimeString(item.created_at.slice(11, 16))}
                                  </Text>
                                </View>
                              </View>
                              {newDate && (
                                <View style={{ width: '100%', alignItems: 'center', paddingVertical: 15 }}>
                                  <Text style={{ color: COLOR.GRAY }}>
                                    {convertToDateString(item.created_at.slice(0, 10))}
                                  </Text>
                                </View>
                              )}
                            </>
                          );
                        }}
                        style={tw`flex-1`}
                      />
                    </View>
                  )}
                </SwrContainer>
                {!isPushEnabled && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 12, color: '#c4c4c4' }}>
                      {'실시간 채팅을 위해서 푸시알림을 활성화 해주세요\n' +
                        '푸시알림이 비활성화 된 경우, 수동으로 새로고침을 하셔야 합니다.'}
                    </Text>
                  </View>
                )}
                <View style={[tw`p-2`, { alignItems: 'center' }]}>
                  <View
                    style={[
                      tw`flex-row border border-gray-300 rounded-lg items-center px-3`,
                      { height: 50, width: '88%', borderWidth: 2 },
                    ]}>
                    <Pressable
                      style={tw`mr-2`}
                      onPress={async () => {
                        const [uri] = await uploadImages({ maxSelectedAssets: 1 });
                        if (uri) {
                          await axios.post(`${API_HOST}/v1/chat-rooms/${id}/messages`, {
                            message: JSON.stringify({
                              type: 'image',
                              data: uri,
                            }),
                          });
                          await mutate();
                        }
                      }}>
                      <Image
                        source={require('../../../assets/plus-icon.png')}
                        style={{ width: 27, height: 27 }}
                      />
                    </Pressable>
                    <TextInput
                      style={tw`flex-1 py-2 text-black`}
                      value={text}
                      onChangeText={setText}
                      placeholder='메시지 작성'
                    />
                    <Pressable
                      onPress={async () => {
                        const trimmedText = text.trim();
                        if (!trimmedText) return;
                        setIsSending(true);
                        setText('');
                        await axios.post(`${API_HOST}/v1/chat-rooms/${id}/messages`, {
                          message: JSON.stringify({
                            type: 'text',
                            data: trimmedText,
                          }),
                        });
                        await mutate();
                        setIsSending(false);
                      }}
                      style={tw`ml-2`}>
                      <If condition={isSending}>
                        <Then>
                          <ActivityIndicator />
                        </Then>
                        <Else>
                          <Text style={[tw`font-bold`, { color: 'rgb(0, 175, 242)' }]}>보내기</Text>
                        </Else>
                      </If>
                    </Pressable>
                  </View>
                </View>
              </>
            </TouchableWithoutFeedback>
          </>
        </SwrContainer>
      </KeyboardAvoidingView>
    </WhiteSafeArea>
  );
}
