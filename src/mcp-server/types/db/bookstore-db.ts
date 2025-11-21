export type AuthorDB = {
  id: string; // we use custom IDs for testing/seeding
  name: string; // "J.R.R. Tolkien"
  // bio?: string; // Short description or biography
  // birthDate?: string; // e.g. "1892-01-03"
  // deathDate?: string; // optional
  // nationality?: string; // "British"
  // imageUrl?: string; // portrait photo
  // createdAt: Date;
  // updatedAt: Date;
};

export type BookDB = {
  id: string; // we use custom IDs for testing/seeding
  title: string;
  authorId: string;
  // description: string;
  // coverImageUrl: string;
  category: "Science-Fiction" | "Fantasy" | "Non-Fiction";
  //   publisher: string;
  //   language: "EN" | "NL";
  //   createdAt: Date;
  //   updatedAt: Date;
};

export type BookVariantDB = {
  id: string; // we use custom IDs for testing/seeding
  bookId: string; // reference to BookDB
  // isbn: string; // official ISBN
  format: "Paperback" | "Hardcover" | "Ebook" | "Audiobook";
  // edition?: string; // e.g. "Illustrated", "2nd Edition"
  priceInCents: number;
  currency: "EUR";
  stock: number;
  // pages?: number;
  // coverImageUrl?: string; // override if different from base
  // publishedAt: string;
  //   createdAt: Date;
  //   updatedAt: Date;
};
