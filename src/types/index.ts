

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

// 検索キーワードの型


// {
//   "suggestions": [
//     {
//       "queryPrediction": {
//         "text": {
//           "text": "ピザハット",
//           "matches": [
//             {
//               "endOffset": 2
//             }
//           ]
//         },
//         "structuredFormat": {
//           "mainText": {
//             "text": "ピザハット",
//             "matches": [
//               {
//                 "endOffset": 2
//               }
//             ]
//           }
//         }
//       }
//     },
//     {
//       "placePrediction": {
//         "place": "places/ChIJ4x6WOJYFAWAR0XDZfNgDIuE",
//         "placeId": "ChIJ4x6WOJYFAWAR0XDZfNgDIuE",
//         "text": {
//           "text": "京都府長岡京市開田３丁目１−１９ ピザ＆ワイン テラ",
//           "matches": [
//             {
//               "startOffset": 12,
//               "endOffset": 16
//             },
//             {
//               "startOffset": 17,
//               "endOffset": 19
//             }
//           ]
//         },
//         "structuredFormat": {
//           "mainText": {
//             "text": "ピザ＆ワイン テラ",
//             "matches": [
//               {
//                 "endOffset": 2
//               }
//             ]
//           },
//           "secondaryText": {
//             "text": "京都府長岡京市開田３丁目１−１９",
//             "matches": [
//               {
//                 "startOffset": 12,
//                 "endOffset": 16
//               }
//             ]
//           }
//         },
//         "types": [
//           "pizza_restaurant",
//           "restaurant",
//           "establishment",
//           "point_of_interest",
//           "food"
//         ]
//       }
//     },
//     ...
// }