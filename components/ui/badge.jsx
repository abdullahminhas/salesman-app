import React from "react";
import { View } from "react-native";
import * as Slot from "@rn-primitives/slot";
import { cn } from "../lib/util";
import { TextClassContext } from "./text";
import { cva } from "class-variance-authority";

// Define badge variants for styling
const badgeVariants = cva(
  "web:inline-flex items-center rounded-full border border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary web:hover:opacity-80 active:opacity-80",
        secondary:
          "border-transparent bg-secondary web:hover:opacity-80 active:opacity-80",
        caution: "border-transparent bg-yellow-400/50",
        destructive:
          "border-transparent bg-destructive web:hover:opacity-80 active:opacity-80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Define badge text variants for styling
const badgeTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      caution: "text-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Badge({ className, variant, asChild, ...props }) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
