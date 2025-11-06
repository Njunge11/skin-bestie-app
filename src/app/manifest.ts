import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SkinBestie - Your Honest Bestie for Better Healthier Skin",
    short_name: "SkinBestie",
    description:
      "We collaborate with you to curate a simple routine that's tailored to your lifestyle, your budget, and your skin goals.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF5",
    theme_color: "#195284",
    icons: [
      {
        src: "/Favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
