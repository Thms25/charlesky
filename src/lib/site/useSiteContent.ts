"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { firebaseDb } from "@/lib/firebase/client";
import { defaultSiteContent, type SiteContent } from "@/lib/site/content";

type State =
  | { status: "loading"; data: SiteContent }
  | { status: "ready"; data: SiteContent }
  | { status: "error"; data: SiteContent; error: string };

const SITE_DOC = doc(firebaseDb, "site", "content");

export function useSiteContent() {
  const [state, setState] = useState<State>({ status: "loading", data: defaultSiteContent });

  useEffect(() => {
    const unsub = onSnapshot(
      SITE_DOC,
      (snap) => {
        if (!snap.exists()) {
          setState({ status: "ready", data: defaultSiteContent });
          return;
        }
        const data = snap.data() as Partial<SiteContent>;
        setState({
          status: "ready",
          data: {
            ...defaultSiteContent,
            ...data,
          } as SiteContent,
        });
      },
      (err) => {
        setState({ status: "error", data: defaultSiteContent, error: err.message || "Failed to load site content." });
      }
    );
    return () => unsub();
  }, []);

  const actions = useMemo(() => {
    return {
      async ensureSeeded() {
        await setDoc(SITE_DOC, defaultSiteContent, { merge: true });
      },
    };
  }, []);

  return { ...state, actions };
}

