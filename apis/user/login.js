const connectDB = require("../../db/dbConnect");

async function Login(req, res) {

    try {
        const db = await connectDB();
        const collection = db.collection("users");

        const { email, password } = req.body;
        const user = await collection.findOne({ email, password });

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid username or password" });
        }

        //session creation
        req.session.user = { session: user, isAuth: true };
        const userData = req.session.user;

        res.status(200).json({
            userData,
            success: true,
            message: "Login Successful",
        });
    } catch (error) {
        console.log("login.js: ",error);
        res.status(500).json({ success: false, message: "Login Failed" });
    }
}

module.exports = { Login };
