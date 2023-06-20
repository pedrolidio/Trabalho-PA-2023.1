require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connection = require('../database/connection');

module.exports = {
    async verify(request, response) {
        const user = await connection('users').select('*').where('id', request.userId).first();
        const role = user.email == "admin@epcakes.com" ? ("admin") : (
            user.email == "manager@epcakes.com" ? ("manager") : undefined
        );

        return response.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                whatsapp: user.whatsapp,
                role
            }
        });
    },

    async create(request, response) {
        const { email, password } = request.body;

        const user = await connection('users').select('*').where('email', email).first();

        if(!user) {
            return response.status(400).json({ error: "No user found with this e-mail address" });
        }

        bcrypt.compare(password, user.password).then(function(result) {
            if(result == true) {
                const role = user.email == "admin@epcakes.com" ? ("admin") : (
                    user.email == "manager@epcakes.com" ? ("manager") : undefined
                );

                const token = jwt.sign({ 
                    id: user.id, 
                    role
                }, process.env.TOKEN_SECRET, { 
                    expiresIn: 60 * 60 * 24 /* 1 dia */ 
                });
                
                return response.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        whatsapp: user.whatsapp,
                        role
                    }
                });
            } else {
                return response.status(401).json({ error: "Invalid user credentials" });
            }
        });
    },

    async end(request, response) {
        const token = request.token;
        const expiration = request.tokenExpiration;

        try {
            await connection('tokens_blacklist').insert({
                token,
                expiration
            });
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }

        return response.sendStatus(200);
    },
};
