import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { SearchProvider } from "./context/SearchContext";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  style: "normal",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CarSpot",
  description: "CarSpot",
  authors: { name: "KriPa Web" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={montserratAlternates.className}>
        <ConvexClientProvider>
          <SearchProvider>{children}</SearchProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
