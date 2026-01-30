import { SiteContent } from "@/lib/site/content";
import { Dispatch, SetStateAction } from "react";

export interface MediaLibraryState {
  isOpen: boolean;
  type: "audio" | "image";
  onSelect?: (url: string) => void;
}

export interface AdminTabProps {
  draft: SiteContent;
  setDraft: Dispatch<SetStateAction<SiteContent>>;
  uploadFile: (file: File, type: "audio" | "image") => Promise<string>;
  deleteFile: (url: string) => Promise<void>;
  setMediaLibraryState: Dispatch<SetStateAction<MediaLibraryState>>;
}
