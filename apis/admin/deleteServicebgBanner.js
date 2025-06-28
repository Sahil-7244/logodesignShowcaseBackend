const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");
// const path = require("path");
// const fs = require("fs");

async function DeleteServicebgBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('servicebgImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { servicebgImgId } = req.body;

        if (!ObjectId.isValid(servicebgImgId)) {
            return res.status(400).json({ success: false, message: "Invalid ServicebgImage ID!" });
        }

        // Fetch the servicebgimg to get the image path
        const servicebg = await collection.findOne({ _id: new ObjectId(servicebgImgId) });

        if (!servicebg) {
            return res.status(404).json({ success: false, message: "servicebgimg not found!" });
        }

        // Extract the public_id from the stored Cloudinary image URL
        const servicebgImgUrl = servicebg.servicebgImage; // Assuming this field contains the Cloudinary URL
        const fullname = servicebgImgUrl.split("/").pop().split(".");
        const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
        
        const deletedServicebgImg = await collection.deleteOne({ _id: new ObjectId(servicebgImgId) });

        if (deletedServicebgImg.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "ServicebgImg not found!" });
        }

        return res.status(200).json({ success: true, message: "ServicebgImg deleted successfully" });
    } catch (error) {
        console.error("DeleteServicebgImage.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteServicebgBanner };
