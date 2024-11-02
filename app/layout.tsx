import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { SearchProvider } from "./context/SearchContext";
import { MapDataProvider } from "./context/MapDataContext";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  style: "normal",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CarSpot",
  description: "CarSpot",
  authors: { name: "KriPa Web", url: "https://kripaweb.com" },
  metadataBase: new URL("https://car-spot.vercel.app"),
  keywords: [
    "CarSpot",
    "spots",
    "spots map",
    "car spots",
    "car spots map",
    "car map",
    "car locations",
    "car spotting",
    "post a spot",
    "find a spot",
    "create a spot",
  ],
  icons: [
    {
      url: "/favicon.ico",
      href: "/favicon.ico",
      sizes: "64x64",
      type: "image/ico",
    },
    {
      url: "/apple-touch-icon.png",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "apple-touch-icon",
    },
    {
      url: "/icon-192x192.png",
      href: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      url: "/icon-512x512.png",
      href: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  openGraph: {
    title: "CarSpot",
    description:
      "Explore, discover, and share unique car spotting locations worldwide. Dive into detailed car insights with real-time map features and exclusive car spot data.",
    url: "https://car-spot.vercel.app",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 64,
        height: 64,
        alt: "CarSpot Favicon",
      },
      {
        url: "/apple-touch-icon.png",
        width: 180,
        height: 180,
        alt: "CarSpot Apple Touch Icon",
      },
      {
        url: "/icon-192x192.png",
        width: 192,
        height: 192,
        alt: "CarSpot 192x192",
      },
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "CarSpot 512x512",
      },
    ],
  },
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
          <MapDataProvider>
            <SearchProvider>{children}</SearchProvider>
          </MapDataProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
