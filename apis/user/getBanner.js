const connectDB = require("../../db/dbConnect");

async function GetBanner(req, res) {

    try {
        const db = await connectDB();
        const collection = db.collection("banner");

        const banners = await collection.find().toArray();

        res.status(200).json({
            banners,
            success: true,
            message: "Banners fetch Successful",
        });
    } catch (error) {
        console.log("getBanner.js: ", error);
        res.status(500).json({ success: false, message: "banners fetch Failed" });
    }
}

module.exports = { GetBanner };
