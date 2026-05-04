
// Loading.tsx
// OrdersPage.tsxがレンダリングされるまで表示する


export default function Loading(){
  return (
    <div className="flex justify-between items-center min-h-screen">
      <div className="text-muted-foreground">Loading ...</div>
    </div>
  )
}