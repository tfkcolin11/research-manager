"use client"

import { message, notification } from "antd";

// Re-export Ant Design's message and notification for consistent usage
export const toast = {
  success: (content: string, options?: any) => message.success(content, options?.duration),
  error: (content: string, options?: any) => message.error(content, options?.duration),
  info: (content: string, options?: any) => message.info(content, options?.duration),
  warning: (content: string, options?: any) => message.warning(content, options?.duration),
  loading: (content: string, options?: any) => message.loading(content, options?.duration),
};

export const notify = {
  success: (args: any) => notification.success(args),
  error: (args: any) => notification.error(args),
  info: (args: any) => notification.info(args),
  warning: (args: any) => notification.warning(args),
};