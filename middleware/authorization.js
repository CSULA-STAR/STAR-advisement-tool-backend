const jwt = require('jsonwebtoken');

const config = require('../../config.json');

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Unauthorzied: no token.' });
    }

    try {
        // split header on space and pop out the token string
        const token = authorization.split(' ').pop();

        // if expired or invalid token then jwt verify will throw
        const verifed = jwt.verify(token, config.jwtsecret);
        req.professor = verifed;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorzied: invalid token.' });
    }
};

module.exports = {
    verifyToken
};
