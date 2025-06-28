const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetCounts(req, res) {

    try {
        const db = await connectDB();
        const productCollection = db.collection("products");
        const contactCollection = db.collection("contactUs");
        const enquiryCollection = db.collection("enquiries");
        const totalProductCount = await productCollection.countDocuments();
        const totalContactCount = await contactCollection.countDocuments();
        const totalEnquiryCount = await enquiryCollection.countDocuments();

        if (!req.session.user) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        res.status(200).json({
            totalProductCount,
            totalContactCount,
            totalEnquiryCount,
            success: true,
            message: "Enquiries fetch Successful",
        });
    } catch (error) {
        console.log("getEnquiries.js: ", error);
        res.status(500).json({ success: false, message: "Enquiries fetch Failed" });
    }
}

module.exports = { GetCounts };
