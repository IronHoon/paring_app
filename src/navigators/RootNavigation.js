// RootNavigation.js

import * as React from 'react';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    console.warn('unmounted');
  }
}

export function dispatch(action) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.dispatch(action);
  } else {
    console.warn('unmounted');
  }
}

export function push(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.push(name, params);
  } else {
    console.warn('unmounted');
  }
}

export function setParams(params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.setParams(params);
  } else {
    console.warn('unmounted');
  }
}

export function getCurrentRoute() {
  if (isReadyRef.current && navigationRef.current) {
    return navigationRef.current.getCurrentRoute();
  } else {
    console.warn('unmounted');
  }
}
