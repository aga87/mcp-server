import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { authors, books, bookVariants } from "../mock-data/bookstore";

// --- Credentials (via env) ---
const KEY_PATH =
  process.env.FIREBASE_KEY_PATH ||
  path.resolve("mcp-server-ecommerce-firebase-adminsdk-service-account.json");

if (!fs.existsSync(KEY_PATH)) {
  console.error(`❌ FIREBASE_KEY_PATH not found at: ${KEY_PATH}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(KEY_PATH, "utf8"));

// --- Init Admin SDK ---
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// --- Seed logic ---
(async () => {
  const now = FieldValue.serverTimestamp();

  // Authors
  console.log("👩‍💻 Seeding authors...");
  const authorBatch = db.batch();
  for (const author of authors) {
    const ref = db.collection("authors").doc(author.id);
    authorBatch.set(ref, author);
  }
  await authorBatch.commit();
  console.log(`✅ Seeded ${authors.length} authors.`);

  // Books
  console.log("📚 Seeding books...");
  const bookBatch = db.batch();
  for (const book of books) {
    const ref = db.collection("books").doc(book.id);
    bookBatch.set(ref, book);
  }
  await bookBatch.commit();
  console.log(`✅ Seeded ${books.length} books.`);

  // Book Variants
  console.log("📗 Seeding book variants...");
  const variantBatch = db.batch();
  for (const variant of bookVariants) {
    const ref = db.collection("bookVariants").doc(variant.id);
    variantBatch.set(ref, variant);
  }
  await variantBatch.commit();
  console.log(`✅ Seeded ${bookVariants.length} book variants.`);

  console.log("🎉 All bookstore data seeded successfully.");
  process.exit(0);
})().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
