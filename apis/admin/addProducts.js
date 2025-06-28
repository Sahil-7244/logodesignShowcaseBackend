const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");


async function AddProduct(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('products');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { productName, productDesc, category } = req.body;
        const productImage = req.file?.path;

        if (!productName || !productDesc || !category || !productImage) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        await collection.insertOne({
            productName,
            productDesc,
            category,
            productImage,
            status: "active",
        });

        return res.status(201).json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error("addProducts.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddProduct };
