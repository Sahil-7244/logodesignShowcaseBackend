const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewServicebgBanner(req, res) {
    try {
        const db = await connectDB();
        const servicebgImgcollection = db.collection("servicebgImage");
        const productCollection = db.collection("products");

        const servicebgImg = await servicebgImgcollection.find().toArray();

        if (servicebgImg.length === 0) {
            return res.status(400).json({ success: false, message: "servicebgImg not found" });
        }

        res.status(200).json({
            servicebgImg,
            success: true,
            message: "serviceImg fetch Successful",
        });
    } catch (error) {
        console.log("ViewservicebgImg.js: ", error);
        res.status(500).json({ success: false, message: "servicebgimg fetch Failed" });
    }
}

module.exports = { ViewServicebgBanner };
