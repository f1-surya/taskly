import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017", {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
    strict: true,
  },
});

export default client;
