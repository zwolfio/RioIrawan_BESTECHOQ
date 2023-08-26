const jwt = require('jsonwebtoken');

module.exports = {
    isAuth: (req, res, next) => {
        const token = req.headers['authorization'] || req.query.token;

        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        jwt.verify(token, 'aaa', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Set informasi pengguna ke dalam objek request
            req.user = decoded;
            next();
        });

    }
}