import { type IFirebaseSchema } from "../startup/db";
import { type AuthorDB, type BookDB } from "../types";

// TODO: split into BookRepository and AuthorRepository, and encapsulate in a Bookstore Service?
export class BookstoreRepository {
  private db?: IFirebaseSchema;
  private dbConnectionFn: () => IFirebaseSchema;

  constructor(dbConnectionFn: () => IFirebaseSchema) {
    this.dbConnectionFn = dbConnectionFn;
  }

  private getDB = () => {
    if (!this.db) {
      this.db = this.dbConnectionFn();
    }
    return this.db;
  };

  async getBooks(): Promise<BookDB[]> {
    const snapshot = await this.getDB().books.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  public async getBooksWithAuthors(): Promise<
    (BookDB & { author?: AuthorDB })[]
  > {
    const db = this.getDB();

    const bookSnap = await db.books.get();
    const booksDB = bookSnap.docs.map((doc) => doc.data() as BookDB);

    if (booksDB.length === 0) return [];

    // Extract unique author IDs
    const authorIds = [...new Set(booksDB.map((b) => b.authorId))];

    // Fetch all referenced authors
    const authorSnaps = await Promise.all(
      authorIds.map((id) => db.authors.doc(id).get())
    );

    const authors = authorSnaps
      .filter((snap) => snap.exists)
      .map((snap) => snap.data())
      .filter((author): author is AuthorDB => author !== undefined);

    //  Create a lookup map for fast access
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    // Attach authors to their books
    return booksDB.map((book) => ({
      ...book,
      author: authorMap.get(book.authorId),
    }));
  }
}
