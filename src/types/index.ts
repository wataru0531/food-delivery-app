

// 型定義用のファイル

export type PlacePhoto = {
  name?: string; // オプショナルチェイニング。undefined / nullがあるため
}

export type PlaceSearchResult =  {
  id: string;
  displayName?: {
    languageCode?: string,
    text?: string,
  };
  primaryType?: string;
  photos?: PlacePhoto[]; // 配列
}

export type GooglePlacesSearchApiResponse = {
  places?: PlaceSearchResult[]
}

// 整形後のラーメンレストランの型
export type RestaurantType = {
  id: string;
  restaurantName?: string;
  primaryType?: string;
  photoUrl?: string;
}

// ✅ AutoCompleteのリクエストで取得できるデータの型
export type GooglePlacesAutoCompleteResponseType = {
  suggestions?: PlaceAutoCompleteResult[];
}

export type PlaceAutoCompleteResult = {
  // お店の型
  placePrediction?: {
    place?: string;
    placeId?: string;
    structuredFormat?: {
      mainText?: {
        text?: string
      };
      secondaryText?: {
        text?:string
      }
    }
  }
  // 検索キーワードの型
  queryPrediction?: {
    text?: {
      text?: string;
    }
  }
}

// ✅ 店舗のデータ、検索キーワードをmapとfilterで項目を絞った型。最終的に使う型
export type RestaurantSuggestionType = {
  type: string;
  placeId?: string; // 検索キーワード(queryPrediction)の場合は存在しないので
  placeName: string;
}


// ✅
export type AddressSuggestionType = {
  placeId: string,
  placeName: string,
  address_text: string
}


// ✅ Place Details API resultsに入れる型
export type GooglePlacesDetailsApiResponseType = {
  location?: {
    latitude?: number; // 緯 横
    longitude?: number; // 経度
  }
  displayName?: {
    languageCode?: string;
    text?: string;
  }
  primaryType?: string;
  photos: PlacePhoto[];

}

// ✅ getPlaceDetailsで使う。resultsに入れる型
export type PlaceDetailsAll = {
  location?: {
    latitude?: number;
    longitude?: number;
  }
  displayName?: string;
  primaryType?: string;
  photoUrl?: string;
}


// {id: 12, name: 'RAMEN JUNKEYZ', address_text: '大阪府東大阪市七軒家１２−２７', latitude: 34.6882322, longitude: 135.5892084}
// ✅ 住所の型。使うキーだけデータのみを定義する
export type AddressType = {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}

// ✅ 緯度、経度の型 ... fetchRamenRestaurant()などで使う
export type LocationType = {
  lat: number;
  lng: number;
}


// ✅　カテゴリーごとに分類した型
export type CategoryMenusType = {
  categoryName: string;
  id: string;
  items: MenuType[]
}

// ✅ カテゴリーごとに整形したデータ
export type MenuType = {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
}

// ✅ カートのアイテムの型
export type CartItemType = {
  id: number;
  quantity: number;
  menus: {
    id: number;
    name: string;
    price: number;
    // image_path: string;
    photoUrl: string;
  }
}

// ✅ 
export type CartType = {
  restaurantName: string | undefined;
  photoUrl: string | undefined;
  id: number;
  restaurant_id: string;
  cart_items: CartItemType[];
}

// ✅ 商品1つの型
export type OrderItemsType = {
  photoUrl: string;
  id: number;
  price: number;
  quantity: number;
  name: string;
}

// ✅ 注文履歴 orders
export type OrderType = {
  // 👉 order_itemsはDBから取れないので消しておく
  // order_items: OrderItemsType[];

  restaurantName: string;
  photoUrl: string;
  id: number;
  restaurant_id: string;
  created_at: string;
  fee: number;
  service: number;
  delivery: number;
  subtotal_price: number;
  total_price: number;
}