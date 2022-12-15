import { StorageType } from './config';

export const useStorage = (storageType: StorageType) => {
  let _storage: Storage;
  if (storageType === 'localStorage') {
    _storage = window.localStorage || localStorage;
  } else {
    _storage = window.sessionStorage || sessionStorage;
  }

  const get = (key: string) => {
    return _storage.getItem(key) || '';
  };

  const set = (key: string, value: any) => {
    return _storage.setItem(key, value || '');
  };

  const remove = (key: string) => {
    return _storage.removeItem(key);
  };

  return {
    get,
    set,
    remove,
  };
};
