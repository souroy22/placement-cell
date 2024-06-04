type CustomLocalStorageType = {
  getData: (name: string) => any;
  setData: (name: string, value: any) => void;
  deleteData: (name: string) => void;
  deleteAllData: () => void;
};

export const customLocalStorage: CustomLocalStorageType = {
  getData: (name: string) => {
    if (!name.trim()) return null;
    const val = localStorage.getItem(name);
    return val !== null ? JSON.parse(val) : val;
  },
  setData: (name: string, value: string) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  deleteData: (name: string) => {
    localStorage.removeItem(name);
  },
  deleteAllData: () => {
    localStorage.clear();
  },
};
