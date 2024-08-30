import * as Slot from "@rn-primitives/slot";
import React from "react";
import { Text as RNText } from "react-native";
import { cn } from "../lib/util";

// Create a context with an optional string value
const TextClassContext = React.createContext(undefined);

const Text = React.forwardRef((props, ref) => {
  const { className, asChild = false, ...rest } = props;
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn(
        "text-base text-foreground web:select-text",
        textClass,
        className
      )}
      ref={ref}
      {...rest}
    />
  );
});
Text.displayName = "Text";

export { Text, TextClassContext };
