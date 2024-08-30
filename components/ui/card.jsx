import React from "react";
import { Text, View } from "react-native";
import { TextClassContext } from "./text";
import { cn } from "../lib/util";

const Card = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <View
      ref={ref}
      className={cn(
        "rounded-none border-none bg-card shadow-non shadow-foreground/10",
        className
      )}
      {...rest}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <View
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...rest}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <Text
      role="heading"
      aria-level={3}
      ref={ref}
      className={cn(
        "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
        className
      )}
      {...rest}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <Text
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View ref={ref} className={cn("p-6 pt-0", className)} {...rest} />
    </TextClassContext.Provider>
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <View
      ref={ref}
      className={cn("flex flex-row items-center p-6 pt-0", className)}
      {...rest}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
