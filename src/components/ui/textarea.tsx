import { Input } from "antd";
import * as React from "react";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Input.TextArea>
>(({ className, ...props }, ref) => {
  return (
    <Input.TextArea
      className={className}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };