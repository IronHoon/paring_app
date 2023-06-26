import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const subscribers = {};

const addSubscriber = (key, callback) => {
  subscribers[key] = [...getSubscribers(key), callback];
};
const getSubscribers = (key) => {
  return subscribers[key] || [];
};
const removeSubscriber = (key, callback) => {
  subscribers[key] = getSubscribers(key).filter((x) => x !== callback);
};

const notify = (key, newValue, exclude) => {
  for (const s of getSubscribers(key)) {
    if (s === exclude) continue;
    try {
      s(newValue);
    } catch (e) {
      console.error(e);
    }
  }
};

const usePersistentState = (
  key,
  initialValue = {
    data: [],
    page: 1,
    lastPage: 1,
  },
) => {
  const [value, setValue] = useState(initialValue);
  const [hasValue, setHasValue] = useState(false);

  const onChanged = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const removeItem = (id) => {
    if (value.data) {
      const filteredData = value.data.filter((x) => x.id !== id);
      const newValue = {
        ...value,
        data: filteredData,
      };

      notify(key, newValue, onChanged);
      AsyncStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    }
  };

  useEffect(() => {
    addSubscriber(key, onChanged);
    return () => removeSubscriber(key, onChanged);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        if (!keys.includes(key)) {
          if (initialValue) await AsyncStorage.setItem(key, JSON.stringify(initialValue));
        } else setValue(JSON.parse(await AsyncStorage.getItem(key)));
        setHasValue(true);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return [
    hasValue ? value : initialValue,
    (newValue) => {
      notify(key, newValue, onChanged);
      AsyncStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
    hasValue,
    removeItem,
  ];
};

export default usePersistentState;
