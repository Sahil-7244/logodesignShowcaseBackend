const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");
// const fs = require("fs");
// const path = require("path");

async function DeleteTeam(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('team');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { teammemberId } = req.body;

        if (!ObjectId.isValid(teammemberId)) {
            return res.status(400).json({ success: false, message: "Invalid Team ID!" });
        }

        // Fetch the team member to get the image path
        const teamMember = await collection.findOne({ _id: new ObjectId(teammemberId) });

        if (!teamMember) {
            return res.status(404).json({ success: false, message: "Team member not found!" });
        }

       // Extract the public_id from the stored Cloudinary image URL
       const teammemberImgUrl = teamMember.teammemberImage; // Assuming this field contains the Cloudinary URL
       const fullname = teammemberImgUrl.split("/").pop().split(".");
       const publicId = "teamImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

       // Delete the image from Cloudinary
       await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});

        const deletedteammember = await collection.deleteOne({ _id: new ObjectId(teammemberId) });

        if (deletedteammember.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "teammember not found!" });
        }

        return res.status(200).json({ success: true, message: "teammember deleted successfully" });
    } catch (error) {
        console.error("DeleteTeam.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteTeam };
