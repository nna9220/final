export const getTokenFromUrlAndSaveToStorage = () => {
  const userToken = sessionStorage.getItem('userToken');
  if (userToken == null) {
    const urlParams = new URLSearchParams(window.location.search);
    const userToken1 = urlParams.get('token');

    if (userToken1) {
      // Lưu token vào sessionStorage
      sessionStorage.setItem('userToken', userToken1);
      return userToken1;
    }
    return null;
  }
  else {
    return userToken;
  }
};