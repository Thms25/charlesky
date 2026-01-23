"use cache";

import { cacheTag } from "next/cache";
import { getSiteContent } from "@/lib/site/server-content";
import { ContactContent } from "./contact-content";

export default async function Contact() {
  cacheTag("site-content");
  const data = await getSiteContent();

  return <ContactContent data={data} />;
}
