const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");


async function AddBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('banner');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { bannerTitle, bannerDesc } = req.body;
        const bannerImg = req.file?.path;

        if (!bannerTitle || !bannerDesc || !bannerImg) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        await collection.insertOne({
            bannerTitle,
            bannerDesc,
            bannerImg,
        });

        return res.status(201).json({ success: true, message: "Banner added successfully" });
    } catch (error) {
        console.error("addBanner.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddBanner };
