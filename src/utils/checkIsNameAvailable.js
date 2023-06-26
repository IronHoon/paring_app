// 이름 중복 체크하는 함수

import checkAvailableName from '../net/auth/checkAvailableName';

async function checkIsNameAvailable(name) {
  let isAvailableName = false;
  try {
    const availability = await checkAvailableName(name);

    if (availability && availability[0]?.message) {
      isAvailableName = true;
    } else {
      isAvailableName = false;
    }
  } catch (error) {
    isAvailableName = false;
    console.warn(error);
  }
  return isAvailableName;
}

export default checkIsNameAvailable;
