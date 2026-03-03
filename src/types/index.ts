

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




