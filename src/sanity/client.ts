import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
 

export const client = createClient({
  projectId: "dfbnlmrf",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN_ID,
  ignoreBrowserTokenWarning:true
});

const { projectId, dataset } = client.config();


export const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;