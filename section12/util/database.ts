import { Db, MongoClient, ServerApiVersion } from "mongodb";

let database: Db;

const uri =
  "mongodb+srv://nodejs:chmIiGq8tLlXsnHd@cluster0.1h7avzh.mongodb.net/shop?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const getDb = () => {
  if (database) return database;
  throw "No DB found!";
};

const mongoConnect = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    database = client.db("shop");
    /* const ratings = database.collection("<collName>");
    const cursor = ratings.find(); */
    // Send a ping to confirm a successful connection
    await database.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
};

//mongoConnect().catch(console.dir);

export default mongoConnect;
