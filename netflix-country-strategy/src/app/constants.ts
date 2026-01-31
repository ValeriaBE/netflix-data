export const FOCUS_COUNTRIES = {
    US: "United States",
    CA: "Canada",
  } as const;
  
  export type FocusMode = "both" | "us" | "ca";
  
  export type ChapterKey = "catalog" | "rating" | "genre" | "type";
  
  export const CHAPTERS: Array<{
    key: ChapterKey;
    title: string;
    description: string;
  }> = [
    {
      key: "catalog",
      title: "The Catalog",
      description:
        "Each dot is an anonymized title. We start by looking at the overall pool and how U.S. and Canada compare at a high level.",
    },
    {
      key: "rating",
      title: "Maturity Lens",
      description:
        "Titles regroup by rating to reveal how content maturity differs between U.S. and Canada.",
    },
    {
      key: "genre",
      title: "Genre Worlds",
      description:
        "Titles reorganize into genre clusters to show what Netflix invests in across the two markets.",
    },
    {
      key: "type",
      title: "Format Check",
      description:
        "Finally, titles split by Movie vs TV Show. This checks whether format differences are meaningful relative to ratings and genres.",
    },
  ];
  