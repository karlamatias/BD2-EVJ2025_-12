const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");

async function conectar() {
  await client.connect();
  return client.db("Proyecto1");
}

module.exports = conectar;
