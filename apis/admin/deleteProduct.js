const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");
// const path = require("path");
// const fs = require("fs");

async function DeleteProduct(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('products');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { productId } = req.body;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID!" });
        }

        // Fetch the productimg to get the image path
        const product = await collection.findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ success: false, message: "productimg not found!" });
        }

        // Extract the public_id from the stored Cloudinary image URL
        const productImgUrl = product.productImage; // Assuming this field contains the Cloudinary URL
        const fullname = productImgUrl.split("/").pop().split(".");
        const publicId = "productImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});

        const deletedProduct = await collection.deleteOne({ _id: ObjectId.createFromHexString(productId) });

        if (deletedProduct.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("deleteProduct.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteProduct };
