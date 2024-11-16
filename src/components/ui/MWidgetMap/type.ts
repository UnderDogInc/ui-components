export interface AxiosResponse {
  data: CdekType[];
}

export interface CdekType {
  code: string;
  name: string;
  location: Location;
  work_time: Worktime;
  note?: string;
  owner_code: string;
  nearest_station: string;
  nearest_metro_station?: string;
  site?: string;
  email: string;
  address_comment?: string;
  office_images?: string[];
  dimensions?: any;
  have_cashless: boolean;
  have_cash: boolean;
  allowed_cod: boolean;
  is_dressing_room: boolean;
  is_handout: boolean;
  is_reception: boolean;
  weight_max?: number;
  weight_min?: number;
  take_only: boolean;
}

export interface Worktime {
  time: string;
  list: List[];
  exceptions?: any;
}

export interface List {
  day: number;
  time: string;
}

export interface Location {
  city: string;
  city_code: number;
  full_address: string;
  address: string;
  postal_code: string;
  longitude: number;
  latitude: number;
  region: string;
  region_code: number;
}