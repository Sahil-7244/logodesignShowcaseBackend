const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewCarouselImg(req, res) {
    try {
        const db = await connectDB();
        const carouselImgcollection = db.collection("carouselImage");
        const productCollection = db.collection("products");

        const carouselImg = await carouselImgcollection.find().toArray();

        if (carouselImg.length === 0) {
            return res.status(400).json({ success: false, message: "carouselImg not found" });
        }

        res.status(200).json({
            carouselImg,
            success: true,
            message: "carouselImg fetch Successful",
        });
    } catch (error) {
        console.log("ViewcarouselImg.js: ", error);
        res.status(500).json({ success: false, message: "Enquiries fetch Failed" });
    }
}

module.exports = { ViewCarouselImg };
