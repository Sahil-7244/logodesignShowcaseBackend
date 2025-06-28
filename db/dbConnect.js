const { MongoClient } = require("mongodb");

const connectDB = async () => {
//  const dbUrl = "mongodb+srv://jvcinfographics:JVC3836@cluster0.b4wyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const dbUrl = "mongodb+srv://sahildb788:sahil7244@cluster1.7c2ai9b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
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
