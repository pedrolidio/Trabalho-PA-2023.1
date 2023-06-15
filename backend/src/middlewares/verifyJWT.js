require('dotenv').config();
const jwt = require('jsonwebtoken');

const connection = require('../database/connection');

const verifyJWT = async (request, response, next) => {
    const authHeader = request.headers['authorization'];

    if(!authHeader)
       return response.status(401).json({ error: "No token received"});

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
        if(error)
            return response.status(401).json({ error: "Invalid token received"});

        const isExpired = await connection('tokens_blacklist').select('token').where('token', token).first();

        if(isExpired)
            return response.status(403).json({ error: "Expired token received"});

        const date = new Date(decoded.exp * 1000);
        date.setDate(date.getDate() + 1);

        request.userId = decoded.id;
        request.token = token;
        request.tokenExpiration = date.toLocaleDateString('pt-BR');
        
        next();
    });
}

module.exports = verifyJWT;