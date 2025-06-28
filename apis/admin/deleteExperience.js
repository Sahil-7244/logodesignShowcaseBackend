const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function DeleteExperience(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('experience');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { experienceId } = req.body;

        if (!ObjectId.isValid(experienceId)) {
            return res.status(400).json({ success: false, message: "Invalid experience ID!" });
        }

        // Fetch the experience to get the image path
        const experience = await collection.findOne({ _id: new ObjectId(experienceId) });

        if (!experience) {
            return res.status(404).json({ success: false, message: "experience not found!" });
        }

        const deletedexperience = await collection.deleteOne({ _id: new ObjectId(experienceId) });

        if (deletedexperience.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "experience not found!" });
        }

        return res.status(200).json({ success: true, message: "experience deleted successfully" });
    } catch (error) {
        console.error("DeleteExperience.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteExperience };
