
// ✅ サジェスチョンで指定した詳細ページ
//    店舗の詳細ページ


// ✅ metadata
//    → layoutの %s に入るtitleを設定 → "ここでのtitle | layoutのtitleのtemplate"
export async function generateMetadata({ params }) {


  return {
    title: `店舗詳細ページ`,
  }
}


export default function RestaurantPage(){
  return(
    <div>詳細</div>
  )
}


