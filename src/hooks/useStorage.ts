const useStorage = () => {
  const setCookie = (name: string, value: string, expiration?: Date, path?: string, domain?: string) => {
    let cookieString = `${name}=${value};`;

    if (expiration) cookieString += `Expires=${expiration.toUTCString()};`;
    if (path) cookieString += `Path=${path};`;
    if (domain) cookieString += `Domain=${domain};`;

    document.cookie = cookieString;
  };

  const getCookie = (name: string) => {
    const cookies = `; ${document.cookie}`;
    const cookieValues = cookies.split(`; ${name}=`);

    if (cookieValues && cookieValues.length > 1) return cookieValues.pop()?.split(";")[0] ?? null;
    return null;
  };

  const setToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_error) {}
  };

  const getFromStorage = (key: string): any => {
    const data = localStorage.getItem(key);

    try {
      return data ? JSON.parse(data) : null;
    } catch (_error) {
      return null;
    }
  };

  return { setCookie, getCookie, setToStorage, getFromStorage };
};

export default useStorage;
