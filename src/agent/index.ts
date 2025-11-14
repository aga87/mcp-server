import "dotenv/config";

import { bookstoreAgent } from "./startup/services";

(async () => {
  const customerQuery = "Can you recommend me a sci-fi book?";

  console.log("Customer:", customerQuery);

  const answer = await bookstoreAgent.handleCustomerQuery(customerQuery);

  console.log("\nAgent:", answer);
})();
