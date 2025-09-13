export interface PlacesApiResponse {
  html_attributions: any[];
  results: PlaceResult[];
  status: string;
}

export interface PlaceResult {
  business_status?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  name: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
    periods?: Array<{
      close?: {
        day: number;
        time: string;
      };
      open: {
        day: number;
        time: string;
      };
    }>;
  };
  photos?: Array<{
    height: number;
    width: number;
    photo_reference: string;
    html_attributions: string[];
  }>;
  place_id: string;
  plus_code?: {
    compound_code?: string;
    global_code: string;
  };
  price_level?: number; // 0–4
  rating?: number;
  reference?: string;
  scope?: string;
  types: string[];
  user_ratings_total?: number;
  vicinity?: string;
}


export interface GeocodeResponse {
  results: {
    formatted_address: string;
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    geometry: {
      location: { lat: number; lng: number };
    };
    place_id: string;
  }[];
  status: string;
}