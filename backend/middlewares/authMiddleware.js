const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'Access Denied' });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // ✅ Correct property name
        req.role = decoded.role; // ✅ Store role for authorization
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid Token' });
    }
}

module.exports = verifyToken;
