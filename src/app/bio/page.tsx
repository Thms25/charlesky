"use cache";

import { cacheTag } from "next/cache";
import { getSiteContent } from "@/lib/site/server-content";
import { BioContent } from "./bio-content";

export default async function Bio() {
  cacheTag("site-content");
  const data = await getSiteContent();
  
  return <BioContent data={data} />;
}
