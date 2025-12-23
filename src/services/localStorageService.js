export default function localStorageService() {

  const removeItem = (key) => {
    if (!key) {return;}
    localStorage.removeItem(key);
  };

  const setItem = (key, value) => {
    if (!key || !value) {return;}
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = (key) => {
    if (!key) {return;}
    return JSON.parse(localStorage.getItem(key));
  };

  return {
    setItem,
    removeItem,
    getItem,
  };
}
