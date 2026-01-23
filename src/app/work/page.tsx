"use cache";

import { cacheTag } from "next/cache";import { getSiteContent } from "@/lib/site/server-content";
import { ProjectList } from "./project-list";

export default async function Work() {
  cacheTag("site-content");
  const data = await getSiteContent();

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter">
        {data.work.headline}
      </h1>

      <ProjectList projects={data.work.projects} />
    </div>
  );
}
