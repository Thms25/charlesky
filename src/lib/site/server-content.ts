import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/client";
import { defaultSiteContent, type SiteContent } from "@/lib/site/content";

const SITE_DOC_ID = "content";
const SITE_COLLECTION = "site";

export async function getSiteContent(): Promise<SiteContent> {
  // Use Firebase data if available, otherwise fallback to defaults
  try {
    const d = doc(firebaseDb, SITE_COLLECTION, SITE_DOC_ID);
    const snap = await getDoc(d);

    if (!snap.exists()) {
      return defaultSiteContent;
    }

    const data = snap.data() as Partial<SiteContent>;
    return {
      ...defaultSiteContent,
      ...data,
      home: {
        ...defaultSiteContent.home,
        ...(data.home || {}),
        latestRelease: {
          ...defaultSiteContent.home.latestRelease,
          ...(data.home?.latestRelease || {}),
        },
      },
      bio: {
        ...defaultSiteContent.bio,
        ...(data.bio || {}),
        // Arrays like paragraphs/gallery are overwritten by Firestore if they exist
      },
      live: {
        ...defaultSiteContent.live,
        ...(data.live || {}),
      },
      work: {
        ...defaultSiteContent.work,
        ...(data.work || {}),
      },
      contact: {
        ...defaultSiteContent.contact,
        ...(data.contact || {}),
      },
    } as SiteContent;
  } catch (error) {
    console.error("Failed to fetch site content:", error);
    return defaultSiteContent;
  }
}
