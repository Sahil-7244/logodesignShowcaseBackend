const connectDB = require("../../db/dbConnect");

async function AddExperience(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('experience');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { experience, appsdeveloped, consultants, awardswon, employee } = req.body;

        if (!experience || !appsdeveloped || !consultants || !awardswon || !employee) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }
        
        const expexist= await collection.findOne();
        if(expexist){
            return res.status(400).json({ success: false, message: "experience exists to you can't add another experience!" });
        }
        
        await collection.insertOne({
            experience,
            appsdeveloped,
            consultants,
            awardswon,
            employee
        });

        return res.status(201).json({ success: true, message: "Experience added successfully" });
    } catch (error) {
        console.error("AddExperience.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddExperience };
