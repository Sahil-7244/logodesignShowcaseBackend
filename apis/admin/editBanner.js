const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");

async function EditBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('banner');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { bannerId, bannerTitle, bannerDesc } = req.body;
        const newBannerImg = req.file ? req.file.path : undefined;

        if (!ObjectId.isValid(bannerId)) {
            return res.status(400).json({ success: false, message: "Invalid Banner ID!" });
        }

        const existingBanner = await collection.findOne({ _id: ObjectId.createFromHexString(bannerId) });

        if (!existingBanner) {
            return res.status(404).json({ success: false, message: "Banner not found!" });
        }

        // If a new image is uploaded, upload to Cloudinary and delete the old one
        let bannerImgUrl = existingBanner.bannerImg;
        if (newBannerImg) {
            // Delete old image from Cloudinary (if exists)
            const fullname = bannerImgUrl.split("/").pop().split(".");
            const oldpublicId = "bannerImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL
     
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(oldpublicId,(error, result) => {console.log('result :: ', result);});

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(newBannerImg, {
                folder: "bannerImages",
                public_id: `${Date.now()}-${req.file.originalname}`,
                resource_type: "image",
            });

            // Set new image URL from Cloudinary response
            bannerImgUrl = result.secure_url;
        }

        const updatedBanner = {
            bannerTitle: bannerTitle || existingBanner.bannerTitle,
            bannerDesc: bannerDesc || existingBanner.bannerDesc,
            bannerImg: bannerImgUrl,  // Use the Cloudinary URL for the banner image
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(bannerId) }, { $set: updatedBanner });

        return res.status(200).json({ success: true, message: "Banner updated successfully" });
    } catch (error) {
        console.error("editBanner.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditBanner };
