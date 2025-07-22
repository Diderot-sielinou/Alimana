export interface StoreData {
  name: string;
  description: string;
  address: string;
  currency: string;
  city: string;
  state: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
}

export type StoreField = keyof StoreData;

export type UpdateFormData = (field: StoreField, value: string) => void;

export type StoreErrors = Partial<Record<StoreField, string>>;
