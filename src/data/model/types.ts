export type RawRow = {
    Title: string;
    Type: string;
    Genre: string;
    "Release Year": string;
    Rating: string;
    Duration: string;
    Country: string;
  };
  
  export type TitleDatum = {
    id: number;
    country: "United States" | "Canada";
    type: "Movie" | "TV Show" | "Other";
    genre: string;
    rating: string;
    year: number | null;
    duration: string;
  };
  