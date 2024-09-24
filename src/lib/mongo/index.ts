import { MongoClient } from "mongodb"

const URI = process.env.DATABASE_URI as string
const options = {}

if (!URI) throw new Error("No Mongo DB URI provided!")

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(URI, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(URI, options)
  clientPromise = client.connect()
}

export default clientPromise