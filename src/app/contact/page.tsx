import { getSiteContent } from "@/lib/site/server-content";
import { ContactContent } from "./contact-content";

export default async function Contact() {
  const data = await getSiteContent();

  return <ContactContent data={data} />;
}
