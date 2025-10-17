import { type AuthorDB, BookDB, BookVariantDB } from "../types/db/bookstore-db";

export const authors: AuthorDB[] = [
  { id: "1", name: "Isaac Asimov" },
  { id: "2", name: "Terry Pratchett" },
];

export const books: BookDB[] = [
  // --- Asimov ---
  {
    id: "foundation",
    title: "Foundation",
    authorId: "1",
    category: "Science-Fiction",
  },
  {
    id: "irobot",
    title: "I, Robot",
    authorId: "1",
    category: "Science-Fiction",
  },

  // --- Pratchett ---
  {
    id: "mort",
    title: "Mort",
    authorId: "2",
    category: "Fantasy",
  },
  {
    id: "goodomens",
    title: "Good Omens",
    authorId: "2",
    category: "Fantasy",
  },
];

export const bookVariants: BookVariantDB[] = [
  // Foundation
  {
    id: "foundation-paperback",
    bookId: "foundation",
    format: "Paperback",
    priceInCents: 1099,
    currency: "EUR",
    stock: 40,
  },
  {
    id: "foundation-hardcover",
    bookId: "foundation",
    format: "Hardcover",
    priceInCents: 1799,
    currency: "EUR",
    stock: 2,
  },

  // I, Robot
  {
    id: "irobot-paperback",
    bookId: "irobot",
    format: "Paperback",
    priceInCents: 999,
    currency: "EUR",
    stock: 5,
  },
  {
    id: "irobot-ebook",
    bookId: "irobot",
    format: "Ebook",
    priceInCents: 699,
    currency: "EUR",
    stock: -1, // unlimited
  },

  // Mort
  {
    id: "mort-paperback",
    bookId: "mort",
    format: "Paperback",
    priceInCents: 899,
    currency: "EUR",
    stock: 10,
  },
  {
    id: "mort-hardcover",
    bookId: "mort",
    format: "Hardcover",
    priceInCents: 1599,
    currency: "EUR",
    stock: 1,
  },

  // Good Omens
  {
    id: "goodomens-paperback",
    bookId: "goodomens",
    format: "Paperback",
    priceInCents: 1099,
    currency: "EUR",
    stock: 3,
  },
  {
    id: "goodomens-audiobook",
    bookId: "goodomens",
    format: "Audiobook",
    priceInCents: 1699,
    currency: "EUR",
    stock: -1, // unlimited
  },
];
