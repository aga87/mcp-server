import { DocumentData, getFirestore } from "firebase-admin/firestore";
import {
  type AuthorDB,
  type BookDB,
  type BookVariantDB,
  type CartItemDB,
} from "../types";

// Firestore data converter: to use Firestore with TypeScript
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T extends DocumentData>(collectionPath: string) =>
  getFirestore().collection(collectionPath).withConverter(converter<T>());

export const getDBConnection = (): IFirebaseSchema => ({
  authors: dataPoint<AuthorDB>("authors"),
  books: dataPoint<BookDB>("books"),
  bookVariants: dataPoint<BookVariantDB>("bookVariants"),
  cartItems: dataPoint<CartItemDB>("cartItems"),
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFirebaseSchema {
  authors: FirebaseFirestore.CollectionReference<AuthorDB, DocumentData>;
  books: FirebaseFirestore.CollectionReference<BookDB, DocumentData>;
  bookVariants: FirebaseFirestore.CollectionReference<
    BookVariantDB,
    DocumentData
  >;
  cartItems: FirebaseFirestore.CollectionReference<CartItemDB, DocumentData>;
}
