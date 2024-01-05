import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SIMPLE",
    short_name: "SIMPLE",
    theme_color: "#01579b",
    background_color: "#ffffff",
    display: "fullscreen",
    orientation: "any",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "/favicon128.png",
        type: "image/png",
        sizes: "128x128",
      },
      {
        src: "/favicon256.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        src: "/favicon512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}
