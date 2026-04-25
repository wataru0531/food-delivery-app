

// /components/ui/CartSkeleton.tsx
// 支払いページのSWRのローディング中に表示

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function CartSkeleton() {
  return (
    <Card className="max-w-md min-w-[420px] space-y-4">
      {/* Header */}
      <CardHeader>
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
        <Skeleton className="w-full h-10" /> {/* ボタンの代替 */}
      </CardHeader>

      <CardContent>
        <hr className="my-2" />
        {/* カート中身 */}
        <div className="mt-4 space-y-3">
          <Skeleton className="w-48 h-4" />
          {/* 複数のアイテムを想定 */}
          {[...Array(1)].map((_, i) => (
            <div className="flex items-center gap-4" key={i}>
              <Skeleton className="min-w-14 min-h-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-3" />
              </div>
              <Skeleton className="w-20 h-9 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full space-y-4">
          <Skeleton className="w-32 h-5" /> {/* 注文の合計額タイトル */}
          <ul className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <li className="flex justify-between" key={i}>
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-12 h-4" />
              </li>
            ))}
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between">
            <Skeleton className="w-16 h-5" />
            <Skeleton className="w-16 h-5" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}






