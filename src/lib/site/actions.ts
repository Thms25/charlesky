"use server";

import { revalidateTag } from "next/cache";

export async function revalidateSiteContent() {
  revalidateTag("site-content", "default");
}
