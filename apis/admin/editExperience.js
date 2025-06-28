const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function EditExperience(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('experience');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { experienceId, experience, appsdeveloped, consultants, awardswon, employee } = req.body;
        
        if (!ObjectId.isValid(experienceId)) {
            return res.status(400).json({ success: false, message: "Invalid experience ID!" });
        }

        const existingExperience = await collection.findOne({ _id: new ObjectId(experienceId) });

        if (!existingExperience) {
            return res.status(404).json({ success: false, message: "Experience Detail not found!" });
        }

        const updatedExperience = {
            experience: experience || existingExperience.experience, 
            appsdeveloped: appsdeveloped || existingExperience.appsdeveloped, 
            consultants: consultants || existingExperience.consultants, 
            awardswon: awardswon || existingExperience.awardswon, 
            employee: employee || existingExperience.employee
        };

        await collection.updateOne({  _id: new ObjectId(experienceId) }, { $set: updatedExperience });

        return res.status(200).json({ success: true, message: "Experience updated successfully" });
    } catch (error) {
        console.error("EditExperience.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditExperience };
