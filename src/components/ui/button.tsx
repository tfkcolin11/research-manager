"use client";

import React from "react";
import { Button as AntButton } from "antd";

// Define a simplified ButtonProps interface that maps to Ant Design's Button props
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  htmlType?: "button" | "submit" | "reset";
  color?: "default" | "primary" | "danger" | "blue" | "purple" | "cyan" | "green" | "magenta" | "pink" | "red" | "orange" | "yellow" | "volcano" | "geekblue" | "lime" | "gold";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, htmlType, color, ...props }, ref) => {
    let antButtonType: "primary" | "default" | "dashed" | "text" | "link" | undefined = "default";
    let antButtonDanger = false;
    let antButtonSize: "large" | "middle" | "small" | undefined = "middle";

    switch (variant) {
      case "default":
        antButtonType = "primary";
        break;
      case "destructive":
        antButtonType = "primary";
        antButtonDanger = true;
        break;
      case "outline":
        antButtonType = "default";
        break;
      case "secondary":
        antButtonType = "default"; // Ant Design doesn't have a direct secondary type, use default
        break;
      case "ghost":
        antButtonType = "text";
        break;
      case "link":
        antButtonType = "link";
        break;
      default:
        antButtonType = "default";
    }

    switch (size) {
      case "sm":
        antButtonSize = "small";
        break;
      case "lg":
        antButtonSize = "large";
        break;
      case "icon":
        antButtonSize = "middle"; // Ant Design doesn't have a direct icon size, use middle
        break;
      default:
        antButtonSize = "middle";
    }

    return (
      <AntButton
        type={antButtonType}
        danger={antButtonDanger}
        size={antButtonSize}
        className={className}
        ref={ref}
        htmlType={htmlType}
        color={color}
        {...props as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'>}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
