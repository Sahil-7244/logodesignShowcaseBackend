const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetCounts(req, res) {

    try {
        const db = await connectDB();
        const productCollection = db.collection("products");
        const bannerCollection = db.collection("banner");
        const carouselImageCollection = db.collection("carouselImage");
        const totalProductCount = await productCollection.countDocuments();
        const totalBannerCount = await bannerCollection.countDocuments();
        const totalCarouselImageCount = await carouselImageCollection.countDocuments();
console.log(req.session.user);
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        res.status(200).json({
            totalProductCount,
            totalBannerCount,
            totalCarouselImageCount,
            success: true,
            message: "Enquiries fetch Successful",
        });
    } catch (error) {
        console.log("getEnquiries.js: ", error);
        res.status(500).json({ success: false, message: "Enquiries fetch Failed" });
    }
}

module.exports = { GetCounts };
