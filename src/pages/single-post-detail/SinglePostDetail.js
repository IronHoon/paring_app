import React, { useCallback, useMemo, useState } from 'react';
import { BackHandler, SafeAreaView } from 'react-native';
import { withContext } from 'context-q';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavHead, WhiteSafeArea } from '../../components/layouts';
import getPost from '../../net/post/getPost';
import { Spinner } from '../../atoms/image';
import NoData from '../../atoms/carousel/NoData';
import PostRenderItem from '../../components/PostRenderItem';
import EditFeedModal from '../../components/modal/EditFeedModal';
import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';

function SinglePostDetailPage(props) {
  const myId = props?.context?.user?.id;
  const myEmail = props?.context?.user?.email;

  const navigation = useNavigation();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [feed, setFeed] = useState(null);

  const { data, error, isLoading, mutate } = useFetch(
    props.route?.params?.feedId ? `${API_HOST}/v1/posts/${props.route?.params?.feedId}` : null,
  );
  const selectedPostData = useMemo(() => {
    if (!data) return null;
    let result = { ...data };
    result.params = {
      myId: myId,
      myEmail: myEmail,
      isSelected: true,
      handleEditPost: handleEditPost,
      setBackPressParams: setBackPressParams,
    };
    return result;
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', setBackPressParams);
      return () => BackHandler.removeEventListener('hardwareBackPress', setBackPressParams);
    }, [props.route?.params?.from]),
  );

  const handleEditPost = (boolean = true, params) => {
    if (params) setFeed(params);
    setOpenEditModal(boolean);
  };

  const setBackPressParams = () => {
    navigation.goBack();
    return true;
  };

  return (
    <WhiteSafeArea>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {/* Contents */}
        <SafeAreaView>
          <NavHead
            onLeftPress={() => {
              setBackPressParams?.();
            }}
          />
          {isLoading && <Spinner />}
          {!isLoading &&
            (selectedPostData ? (
              <PostRenderItem
                item={selectedPostData}
                index={0}
              />
            ) : (
              <NoData />
            ))}

          {openEditModal && (
            <EditFeedModal
              todo={'edit'}
              feed={feed}
              visible={openEditModal}
              route={props.route}
              handleVisible={handleEditPost}
            />
          )}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </WhiteSafeArea>
  );
}

export default withContext(SinglePostDetailPage);
