import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import COLOR from '../../../../constants/COLOR';
import { Spacer } from '../../../atoms/layout';
import UploadSelect from './UploadSelect';
import { getBottomList, getOuterList, getStyleList, getTopList } from '../../../utils/getMetaLists';
import { Spinner } from '../../../atoms/image';

const FormArea = (props) => {
  const { feedData, setFeedData } = props;
  const [styles, setStyles] = useState([]);
  const [outers, setOuters] = useState([]);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        const styleList = await getStyleList();
        setStyles(styleList.slice(0, -1));
        const outerList = await getOuterList();
        setOuters([...outerList]);
        const topList = await getTopList();
        setTops([...topList.slice(0, -1)]);
        const bottomList = await getBottomList();
        setBottoms([...bottomList]);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            multiline={true}
            placeholder={'내용을 입력해주세요'}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: COLOR.HR_GRAY,
              color: COLOR.UPLOAD_TEXT,
              paddingBottom: 10,
            }}
            onChangeText={(text) => setFeedData({ ...feedData, content: text })}
            value={feedData?.content}
          />
          <Spacer height={25} />
          <UploadSelect
            placeholder={{
              label: '선택',
              value: null,
              color: '#ccc',
            }}
            label={'스타일'}
            value={feedData?.style}
            onValueChange={(value) => setFeedData({ ...feedData, style: value })}
            items={styles}
          />
          <UploadSelect
            placeholder={{
              label: '선택',
              value: null,
              color: '#ccc',
            }}
            label={'아우터'}
            value={feedData?.outer}
            onValueChange={(value) => setFeedData({ ...feedData, outer: value })}
            items={outers}
          />
          <UploadSelect
            placeholder={{
              label: '선택',
              value: null,
              color: '#ccc',
            }}
            label={'상 의'}
            value={feedData?.top}
            onValueChange={(value) => setFeedData({ ...feedData, top: value })}
            items={tops}
          />
          <UploadSelect
            placeholder={{
              label: '선택',
              value: null,
              color: '#ccc',
            }}
            label={'하 의'}
            value={feedData?.bottom}
            onValueChange={(value) => setFeedData({ ...feedData, bottom: value })}
            items={bottoms}
          />
        </>
      )}
    </View>
  );
};

export default FormArea;
