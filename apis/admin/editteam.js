const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");

async function EditTeam(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('team');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { teammemberId, teammemberName, teammemberrole } = req.body;
        const newteammemberImage = req.file ? req.file.path : undefined;

        if (!ObjectId.isValid(teammemberId)) {
            return res.status(400).json({ success: false, message: "Invalid teammember ID!" });
        }

        const existingteammember = await collection.findOne({ _id: ObjectId.createFromHexString(teammemberId) });

        if (!existingteammember) {
            return res.status(404).json({ success: false, message: "team member not found!" });
        }
        let teammemberImageUrl = existingteammember.teammemberImage;

        // If a new image is uploaded, upload it to Cloudinary
        if (newteammemberImage) {
            // Delete the old image from Cloudinary (if exists)
            const fullname = teammemberImageUrl.split("/").pop().split(".");
            const oldpublicId = "teamImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL
     
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(oldpublicId,(error, result) => {console.log('result :: ', result);});

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(newteammemberImage, {
                folder: "teamImages",
                public_id: `${Date.now()}-${req.file.originalname}`,
                resource_type: "image",
            });

            // Set new image URL from Cloudinary response
            teammemberImageUrl = result.secure_url;
        }

        const updatedteammember = {
            teammemberName: teammemberName || existingteammember.teammemberName,
            teammemberrole: teammemberrole || existingteammember.teammemberrole,
            teammemberImage: teammemberImageUrl,
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(teammemberId) }, { $set: updatedteammember });

        return res.status(200).json({ success: true, message: "team member updated successfully" });
    } catch (error) {
        console.error("Editteam.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditTeam };
