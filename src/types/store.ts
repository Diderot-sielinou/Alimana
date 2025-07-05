export interface StoreData {
  storeName: string;
  storeDescription: string;
  address: string;
  city: string;
  state: string;
  streetaddress: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
}

export type StoreField = keyof StoreData;

export type UpdateFormData = (field: StoreField, value: string) => void;

export type StoreErrors = Partial<Record<StoreField, string>>;
