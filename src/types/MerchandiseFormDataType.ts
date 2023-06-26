export type MerchandiseFormDataType = {
  id?: number;
  images?: string[];
  brand?: string;
  name?: string;
  price?: string;
  delivery_fee?: string;
  category?: string;
  size?: string;
  condition?: string;
  description?: string;
};

export type MerchandiseItemType = {
  id: number;
  images?: string;
  brand?: string;
  name: string;
  price: number;
  delivery_fee?: number;
  category?: string;
  size?: string;
  condition?: string;
  description?: string;
};

export type MerchandiseListType = {
  data: MerchandiseItemType[];
  lastPage?: number;
  page?: number;
  perPage?: number;
  total?: number;
};
