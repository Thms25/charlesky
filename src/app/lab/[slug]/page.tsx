import { notFound } from "next/navigation";

import LabePageContent from "./labe-page-content";


export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return <LabePageContent slug={slug} />;
}
