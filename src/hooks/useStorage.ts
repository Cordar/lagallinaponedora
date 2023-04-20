const useStorage = () => {
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

  return { setToStorage, getFromStorage };
};

export default useStorage;
