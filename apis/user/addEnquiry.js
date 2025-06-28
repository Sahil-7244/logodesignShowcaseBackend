const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddEnquiry(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("enquiries");
        const productCollection = db.collection("products");

        const { productId, username, email, enquiry } = req.body;

        if (!productId || !username || !email || !enquiry) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields!" });
        }

        const product = await productCollection.findOne({ _id: ObjectId.createFromHexString(productId) });

        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }

        await collection.insertOne({
            productId: ObjectId.createFromHexString(productId),
            username,
            email,
            enquiry,
            date: new Date(),
        });

        return res
            .status(201)
            .json({ success: true, message: "Enquiry Submitted Successful" });

    } catch (error) {
        console.error("addEnquiry.js: ", error);
        return res
            .status(500)
            .json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { AddEnquiry };
