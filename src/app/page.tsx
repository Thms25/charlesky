"use cache";

import { cacheTag } from "next/cache";import { HomePageContent } from "@/components/home/home-page-content";
import { getSiteContent } from "@/lib/site/server-content";

export default async function Home() {
  cacheTag("site-content");
  const data = await getSiteContent();

  return <HomePageContent data={data} />;
}
