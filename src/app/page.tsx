import { HomePageContent } from "@/components/home/home-page-content";
import { getSiteContent } from "@/lib/site/server-content";

export default async function Home() {
  const data = await getSiteContent();

  return <HomePageContent data={data} />;
}
