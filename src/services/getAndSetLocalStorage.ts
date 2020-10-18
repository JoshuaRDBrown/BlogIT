const getAndSetLocalStorage = (action: string, localStorageItemKey: string, value?: any) => {

  const localStore = window.localStorage.getItem(localStorageItemKey)

  if(action === "get") {
    if(localStore) {
      return JSON.parse(localStore);
    }
    return false 
  } else {
    if(typeof(value) == "object" && localStore) {
      const parsedStore = JSON.parse(localStore)
      window.localStorage.setItem(localStorageItemKey, JSON.stringify([...parsedStore, value]));
    } else if(typeof(value) == "object") {
      window.localStorage.setItem(localStorageItemKey, JSON.stringify([value]));
    } else {
      window.localStorage.setItem(localStorageItemKey, JSON.stringify(value));
    }
  }
}

export default getAndSetLocalStorage;