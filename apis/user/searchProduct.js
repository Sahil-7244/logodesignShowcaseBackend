const connectDB = require("../../db/dbConnect");

async function SearchProduct(req, res) {
    const { productName } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection("products");

        // Perform a case-insensitive search using a regular expression
        const product = await collection.find({ productName: { $regex: new RegExp(`^${productName}`, 'i') } }).toArray();

        if (product) {
            res.status(200).json({
                product,
                success: true,
                message: "Product fetch Successful",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
    } catch (error) {
        console.log("searchProduct.js: ",error);
        res.status(500).json({ success: false, message: "Product fetch Failed" });
    }
}

module.exports = { SearchProduct };
