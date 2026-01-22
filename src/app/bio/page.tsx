
import { getSiteContent } from "@/lib/site/server-content";
import { BioContent } from "./bio-content";

export default async function Bio() {
  const data = await getSiteContent();
  
  return <BioContent data={data} />;
}
