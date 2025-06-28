const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetEquiries(req, res) {

    try {
        const db = await connectDB();
        const collection = db.collection("enquiries");

        if (!req.session.user) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "productId is required" });
        }

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product Id" });
        }


        const enquiries = await collection.find({ productId: ObjectId.createFromHexString(productId) }).toArray();

        if (enquiries.length === 0) {
            return res.status(404).json({ success: false, message: "Enquiries not found" });
        }

        res.status(200).json({
            enquiries,
            success: true,
            message: "Enquiries fetch Successful",
        });
    } catch (error) {
        console.log("getEnquiries.js: ", error);
        res.status(500).json({ success: false, message: "Enquiries fetch Failed" });
    }
}

module.exports = { GetEquiries };
