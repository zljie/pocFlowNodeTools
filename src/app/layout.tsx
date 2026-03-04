import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "业务流数据导入系统",
  description: "流程节点数据导入设计工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
