
// MenuModal.tsx
// 店舗詳細ページ、メニュークリック時


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
// import { MenuType } from "@/types";

type MenuModalType = {
  isOpen: boolean;
  closeModal: () => void;
}

export default function MenuModal({ isOpen, closeModal }: MenuModalType) {
  // console.log(isOpen);

  return (
    <Dialog 
      open={ isOpen } 
      onOpenChange={(open) => {
        // console.log(open)
        !open && closeModal();// モーダルの外をクリックした時に閉じる
      }}
      >
      <DialogTrigger>Open</DialogTrigger>

      <DialogContent className="lg:max-w-4xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{"メニュー"}</DialogTitle>
          <DialogDescription>{"メニュー"} の詳細</DialogDescription>
        </DialogHeader>

        <div className="flex gap-6">
          {/* 左 画像 */}
          <div className="relative aspect-square w-1/2 rounded-lg overflow-hidden">
            <Image
              fill
              src={"/no_image.png"}
              alt={"メニュー"}
              className="object-cover"
            />
          </div>

          {/* 右 詳細 */}
          <div className="flex flex-col flex-1 w-1/2">
            {/* 上部：名前と単価 */}
            <div className="space-y-2">
              <p className="text-2xl font-bold">{"メニュー名"}</p>
              <p className="text-lg font-semibold text-muted-foreground">
                ￥{"単価"}
              </p>
            </div>

            {/* 中央：数量セレクト */}
            <div className="mt-4">
              <label htmlFor="quantity" className="sr-only">
                数量
              </label>
              <select
                id="quantity"
                name="quantity"
                className="border rounded-full pr-8 pl-4 h-10"
                aria-label="購入数量"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <DialogClose asChild>
              <Button
                type="button"
                size="lg"
                className="mt-6 h-14 text-lg font-semibold"
              >
                商品を追加（￥価格）
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
