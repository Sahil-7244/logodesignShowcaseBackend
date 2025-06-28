const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetOneProduct(req, res) {

    try {
        const db = await connectDB();
        const collection = db.collection("products");

        const { productId } = req.body;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product Id" });
        }

        const product = await collection.findOne({ _id: ObjectId.createFromHexString(productId) });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            product,
            success: true,
            message: "Product fetch Successful",
        });
    } catch (error) {
        console.log("getOneProduct.js: ", error);
        res.status(500).json({ success: false, message: "Products fetch Failed" });
    }
}

module.exports = { GetOneProduct };
