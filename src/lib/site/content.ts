export type SiteContent = {
  home: {
    tagline: string;
    latestRelease: {
      title: string;
      description: string;
      spotifyEmbedUrl: string;
    };
  };
  bio: {
    headline: string;
    paragraphs: string[];
    gallery: Array<{
      src: string;
      alt: string;
      phraseTitle: string;
      phraseBody: string;
    }>;
  };
  live: {
    headline: string;
    subtitle: string;
    shows: Array<{
      id: string;
      date: string;
      year: string;
      venue: string;
      city: string;
      country: string;
      status: "available" | "sold_out" | "selling_fast";
      ticketLink: string;
    }>;
  };
  work: {
    headline: string;
    projects: Array<{
      id: string;
      title: string;
      artist: string;
      role: string;
      color: string;
    }>;
  };
  contact: {
    headline: string;
    email: string;
    socials: {
      instagram?: string;
      twitter?: string;
      spotify?: string;
      soundcloud?: string;
    };
  };
};

export const defaultSiteContent: SiteContent = {
  home: {
    tagline: "Music Producer & Mixing Engineer",
    latestRelease: {
      title: "QQSP",
      description:
        "The latest drop from Basement Mixtape, Vol. 1. Featuring Basement, NIZ, Moon's, Benito Bxl, and Lookaa. A raw mix of energy and style.",
      spotifyEmbedUrl:
        "https://open.spotify.com/embed/track/2DSbT4h3BA1oIWXC9N0AG5?utm_source=generator&theme=0",
    },
  },
  bio: {
    headline: "BEHIND THE CONSOLE",
    paragraphs: [
      "Charlesky is a music producer and mixing engineer based in Brussels. With a passion for analog warmth and digital precision, he crafts soundscapes that resonate.",
      "Specializing in Synthwave, Electronic, and Pop, his approach combines technical expertise with artistic intuition to bring every artist's vision to life.",
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2070&auto=format&fit=crop",
        alt: "Studio Gear",
        phraseTitle: "Analog Soul",
        phraseBody: "Where vintage hardware meets modern workflow.",
      },
      {
        src: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop",
        alt: "Live Performance",
        phraseTitle: "Live Energy",
        phraseBody: "Translating studio perfection to the stage.",
      },
      {
        src: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop",
        alt: "Mixing Console",
        phraseTitle: "Sonic Precision",
        phraseBody: "Every detail matters in the final mix.",
      },
    ],
  },
  live: {
    headline: "Tour Dates",
    subtitle: "2025 Belgium Tour",
    shows: [
      {
        id: "1",
        date: "OCT 12",
        year: "2025",
        venue: "Ancienne Belgique",
        city: "Brussels",
        country: "Belgium",
        status: "sold_out",
        ticketLink: "#",
      },
      {
        id: "2",
        date: "OCT 15",
        year: "2025",
        venue: "Trix",
        city: "Antwerp",
        country: "Belgium",
        status: "available",
        ticketLink: "#",
      },
      {
        id: "3",
        date: "OCT 18",
        year: "2025",
        venue: "Vooruit",
        city: "Ghent",
        country: "Belgium",
        status: "selling_fast",
        ticketLink: "#",
      },
      {
        id: "4",
        date: "OCT 22",
        year: "2025",
        venue: "Reflektor",
        city: "Liège",
        country: "Belgium",
        status: "available",
        ticketLink: "#",
      },
      {
        id: "5",
        date: "NOV 05",
        year: "2025",
        venue: "Het Depot",
        city: "Leuven",
        country: "Belgium",
        status: "available",
        ticketLink: "#",
      },
      {
        id: "6",
        date: "NOV 12",
        year: "2025",
        venue: "Botanique",
        city: "Brussels",
        country: "Belgium",
        status: "sold_out",
        ticketLink: "#",
      },
    ],
  },
  work: {
    headline: "SELECTED WORK",
    projects: [
      { id: "1", title: "Neon Nights", artist: "The Midnight Echo", role: "Producer / Mix", color: "bg-purple-500" },
      { id: "2", title: "Urban Jungle", artist: "Sarah V", role: "Mixing Engineer", color: "bg-emerald-500" },
      { id: "3", title: "Deep Dive", artist: "Ocean Sounds", role: "Producer", color: "bg-blue-500" },
      { id: "4", title: "Retrograde", artist: "Synthwave Collective", role: "Mastering", color: "bg-pink-500" },
      { id: "5", title: "Acoustic Sessions", artist: "John Doe", role: "Recording / Mix", color: "bg-amber-500" },
      { id: "6", title: "Future Bass", artist: "Drop Zone", role: "Producer / Mix", color: "bg-cyan-500" },
    ],
  },
  contact: {
    headline: "LET'S WORK TOGETHER",
    email: "contact@charlesky.com",
    socials: {},
  },
};
