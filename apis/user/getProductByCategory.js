const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function GetProductsByCategory(req, res) {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');

        const { category } = req.body;


        // Find products by category
        const products = await productsCollection.find({ category: category, status: "active" }).toArray();

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found for this category" });
        }

        return res.status(200).json({ products, success: true, message: "Products fetched successfully" });

    } catch (error) {
        console.error("GetProductsByCategory.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { GetProductsByCategory };
