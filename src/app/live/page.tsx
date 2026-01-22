import { ShowList } from "./show-list";
import { getSiteContent } from "@/lib/site/server-content";

export default async function Live() {
  const data = await getSiteContent();

  return (
    <div className="max-w-6xl mx-auto py-12 min-h-[80vh] px-4 md:px-6">
      <ShowList data={data} />
    </div>
  );
}
