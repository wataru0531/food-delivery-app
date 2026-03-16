

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

