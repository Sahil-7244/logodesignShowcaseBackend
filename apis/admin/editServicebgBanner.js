const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");

async function EditServicebgBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('servicebgImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { servicebgImgId, servicebgImgName } = req.body;
        const newservicebgImage = req.file ? req.file.path : undefined;

        if (!ObjectId.isValid(servicebgImgId)) {
            return res.status(400).json({ success: false, message: "Invalid servicebgImg ID!" });
        }

        const existingservicebgImg = await collection.findOne({ _id: ObjectId.createFromHexString(servicebgImgId) });

        if (!existingservicebgImg) {
            return res.status(404).json({ success: false, message: "ServicebgImg not found!" });
        }
        let servicebgImageUrl = existingservicebgImg.servicebgImage;

        // If a new image is uploaded, upload it to Cloudinary
        if (newservicebgImage) {
            // Delete the old image from Cloudinary (if exists)
            const fullname = servicebgImageUrl.split("/").pop().split(".");
            const oldpublicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL
     
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(oldpublicId,(error, result) => {console.log('result :: ', result);});

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(newservicebgImage, {
                folder: "servicebgImages",
                public_id: `${Date.now()}-${req.file.originalname}`,
                resource_type: "image",
            });

            // Set new image URL from Cloudinary response
            servicebgImageUrl = result.secure_url;
        }

        const updatedservicebgImg = {
            servicebgImgName: servicebgImgName || existingServicebgImg.servicebgImgName,
            servicebgImage: servicebgImageUrl, // Cloudinary URL for the service background image
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(servicebgImgId) }, { $set: updatedservicebgImg });

        return res.status(200).json({ success: true, message: "servicebgImg updated successfully" });
    } catch (error) {
        console.error("EditServicebgImg.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditServicebgBanner };
