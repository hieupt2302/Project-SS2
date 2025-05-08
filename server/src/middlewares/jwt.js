const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-key';

function generateToken(user) {
    return jwt.sign(
        { googleId: user.googleId, displayName: user.displayName, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
