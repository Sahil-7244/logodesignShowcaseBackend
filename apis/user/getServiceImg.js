const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewServiceImg(req, res) {
    try {
        const db = await connectDB();
        const serviceImgcollection = db.collection("serviceImage");
        const productCollection = db.collection("products");

        const serviceImg = await serviceImgcollection.find().toArray();

        if (serviceImg.length === 0) {
            return res.status(400).json({ success: false, message: "serviceImg not found" });
        }

        res.status(200).json({
            serviceImg,
            success: true,
            message: "serviceImg fetch Successful",
        });
    } catch (error) {
        console.log("ViewserviceImg.js: ", error);
        res.status(500).json({ success: false, message: "Enquiries fetch Failed" });
    }
}

module.exports = { ViewServiceImg };
