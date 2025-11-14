import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SkinBestie - Your Honest Bestie for Better Healthier Skin",
    short_name: "SkinBestie",
    description:
      "We collaborate with you to curate a simple routine that's tailored to your lifestyle, your budget, and your skin goals.",
    start_url: "/",
    display: "standalone",
    background_color: "#52957d",
    theme_color: "#195284",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
