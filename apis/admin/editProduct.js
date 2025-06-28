const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");

async function EditProduct(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('products');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { productId, productName, category, productDesc } = req.body;
        const newproductImage =  req.file ? req.file.path : undefined;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID!" });
        }

        const existingProduct = await collection.findOne({ _id: ObjectId.createFromHexString(productId) });

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
// If a new image is uploaded, upload it to Cloudinary
        let productImageUrl = existingProduct.productImage;
        if (newproductImage) {
            // Delete the old image from Cloudinary (if exists)
            const fullname = productImageUrl.split("/").pop().split(".");
            const oldpublicId = "productImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL
     
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(oldpublicId,(error, result) => {console.log('result :: ', result);});

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(newproductImage, {
                folder: "productImages",
                public_id: `${Date.now()}-${req.file.originalname}`,
                resource_type: "image",
            });

            // Set new image URL from Cloudinary response
            productImageUrl = result.secure_url;
        }

        const updatedProduct = {
            productName: productName || existingProduct.productName,
            category: category || existingProduct.category,
            productDesc: productDesc || existingProduct.productDesc,
            productImage: productImageUrl, // Cloudinary URL for the product image
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(productId) }, { $set: updatedProduct });

        return res.status(200).json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.error("editProducts.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditProduct };
