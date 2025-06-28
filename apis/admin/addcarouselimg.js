const connectDB = require("../../db/dbConnect");

async function AddCarouselImg(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('carouselImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { carouselImgName } = req.body;
        const carouselImage = req.file?.path;

        if (!carouselImgName || !carouselImage) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        await collection.insertOne({
            carouselImgName,
            carouselImage,
            status: "active",
        });

        return res.status(201).json({ success: true, message: "carouselImage added successfully" });
    } catch (error) {
        console.error("AddcarouselImage.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddCarouselImg };
