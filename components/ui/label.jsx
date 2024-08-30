import * as LabelPrimitive from "@rn-primitives/label";
import React from "react";
import { cn } from "../lib/util";

const Label = React.forwardRef(
  (
    { className, onPress, onLongPress, onPressIn, onPressOut, ...props },
    ref
  ) => (
    <LabelPrimitive.Root
      className="web:cursor-default"
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <LabelPrimitive.Text
        ref={ref}
        className={cn(
          "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70",
          className
        )}
        {...props}
      />
    </LabelPrimitive.Root>
  )
);

Label.displayName = "Label"; // Update display name to a descriptive name

export { Label };
