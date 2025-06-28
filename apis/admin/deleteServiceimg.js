// const path = require("path");
// const fs = require("fs");
const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");

async function DeleteServiceImage(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('serviceImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { serviceImgId } = req.body;

        if (!ObjectId.isValid(serviceImgId)) {
            return res.status(400).json({ success: false, message: "Invalid ServiceImage ID!" });
        }

        // Fetch the serviceimg to get the image path
        const service = await collection.findOne({ _id: new ObjectId(serviceImgId) });

        if (!service) {
            return res.status(404).json({ success: false, message: "serviceimg not found!" });
        }

        // Extract the public_id from the stored Cloudinary image URL
        const serviceImgUrl = service.serviceImage; // Assuming this field contains the Cloudinary URL
        const fullname = serviceImgUrl.split("/").pop().split(".");
        const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});

        const deletedServiceImg = await collection.deleteOne({ _id: new ObjectId(serviceImgId) });

        if (deletedServiceImg.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "ServiceImg not found!" });
        }

        return res.status(200).json({ success: true, message: "ServiceImg deleted successfully" });
    } catch (error) {
        console.error("DeleteServiceImage.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteServiceImage };
