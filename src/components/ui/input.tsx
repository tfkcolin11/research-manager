import { Input as AntInput } from "antd";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof AntInput>>(
  ({ className, type, ...props }, ref) => {
    return (
      <AntInput
        type={type}
        className={className}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };