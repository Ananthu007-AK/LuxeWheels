const Admin = require('../model/admin');

const adminController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required!" });
            }

            const admin = await Admin.findOne({ email });

            if (!admin) {
                return res.status(404).json({ error: "Admin not found!" });
            }

            if (password !== admin.password) {
                return res.status(401).json({ error: "Incorrect password!" });
            }

            res.status(200).json({ message: "Login successful", admin });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error.message });
        }
    }
};

module.exports = adminController;
