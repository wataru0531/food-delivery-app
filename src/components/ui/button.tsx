
// button.tsx

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// ✅ cva ... class-variance-authority
// 👉 条件によってclassを切り替える関数を返す
// const buttonVariants = cva(
//   "基本クラス",
//   {
//     variants: {
//       variant: { ... },
//       size: { ... }
//     }
//   }
// )

// 
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// console.log(buttonVariants)


function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & // 通常のbuttonが持っているprops全て(onClickやdisabledなど)
  VariantProps<typeof buttonVariants> & // cvaで定義したvariantとsizeを型として自動生成
                                        // ↓ これらを自動生成
                                        // {
                                        //   variant?: "default" | "ghost" | ...
                                        //   size?: "default" | "icon" | ...
                                        // }
  { asChild?: boolean } // 
) {
  const Comp = asChild ? Slot.Root : "button"; // Radixのslotを使うか(true)、普通のbuttonを使うか

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      // buttonVariants() → クラス文字列が返る 👉 クラス文字列を生成して返す関数
      // cn() → クラス名を整理して結合
      // 
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
