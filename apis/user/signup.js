const connectDB = require("../../db/dbConnect");

async function SignUp(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("users");

        const { username, email, phoneNo, password, role } = req.body;

        if (!username || !email || !phoneNo || !password || !role) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields!" });
        }

        const userExist = await collection.findOne({ email });

        if (userExist) {
            return res
                .status(400)
                .json({ success: false, message: "Email Already Exist!" });
        }

        await collection.insertOne({
            username,
            email,
            phoneNo,
            password,
            role: "0",
        });

        return res
            .status(201)
            .json({ success: true, message: "Registration Successful" });

    } catch (error) {
        console.error("signup.js: ", error);
        return res
            .status(500)
            .json({ success: false, error: "Registration Failed" });
    }
}

module.exports = { SignUp };
