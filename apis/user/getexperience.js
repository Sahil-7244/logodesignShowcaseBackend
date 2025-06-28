const connectDB = require("../../db/dbConnect");

async function GetExperience(req, res) {

    try {
        const db = await connectDB();
        const collection = db.collection("experience");

        const experience = await collection.find().toArray();

        res.status(200).json({
            experience,
            success: true,
            message: "experience fetch Successful",
        });
    } catch (error) {
        console.log("GetExperience.js: ",error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { GetExperience };
