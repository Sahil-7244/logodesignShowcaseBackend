const { MongoClient } = require("mongodb");

const connectDB = async () => {
  const dbUrl = process.env.DB_URL;
  try {
    const client = await MongoClient.connect(dbUrl);
    console.log("DB Connected");
    return client.db("JVGRAPHICS"); // Return the db object for further usage
  } catch (error) {
    console.log("DB connection Error: ", error);
    throw error;
  }
};
module.exports = connectDB;
