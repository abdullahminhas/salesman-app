import React from "react";
import { Link } from "expo-router";
import { TextClassContext } from "./text";
import { cn } from "../lib/util";
import { cva } from "class-variance-authority";
import { TouchableOpacity } from "react-native";

const buttonLinkVariants = cva(
  "group flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary web:hover:opacity-90 active:opacity-90",
        destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
        outline:
          "border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
        ghost:
          "web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        link: "web:underline-offset-4 web:hover:underline web:focus:underline ",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        auto: "h-10 native:min-h-12",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 native:h-14",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonLinkTextVariants = cva(
  "web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-destructive-foreground",
        outline: "group-active:text-accent-foreground",
        secondary:
          "text-secondary-foreground group-active:text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: "text-primary group-active:underline",
      },
      size: {
        default: "",
        auto: "",
        sm: "",
        lg: "native:text-lg",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const ButtonLink = React.forwardRef(
  ({ className, variant, size, ...restProps }, ref) => {
    const { href, children, ...restLinkProps } = restProps;

    return (
      <TextClassContext.Provider
        value={cn(
          restProps.disabled && "web:pointer-events-none",
          buttonLinkTextVariants({ variant, size })
        )}
      >
        <Link
          href={href} // Use href for the Link component
          asChild // Use asChild to allow wrapping with TouchableOpacity
        >
          <TouchableOpacity
            className={cn(
              restProps.disabled && "opacity-50",
              buttonLinkVariants({ variant, size, className })
            )}
            ref={ref}
            disabled={restProps.disabled} // Handle disabled state
            {...restLinkProps}
          >
            {children}
          </TouchableOpacity>
        </Link>
      </TextClassContext.Provider>
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export { ButtonLink, buttonLinkTextVariants, buttonLinkVariants };
