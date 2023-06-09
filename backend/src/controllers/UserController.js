const bcrypt = require('bcrypt');

const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const users = await connection('users').select('*');

        return response.json(users);
    },

    async create(request, response) {
        const { name, email, whatsapp } = request.body;
        let { password } = request.body;

        if(!name || !email || !whatsapp || !password) {
            return response.status(400).json({ error: "All registration fields are required" });
        }

        const isEmailAvailable = request.isEmailAvailable;

        if(!isEmailAvailable) {
            return response.status(409).json({ error: "E-mail already registered" });
        }

        try {
            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            await connection('users').insert({
                name,
                email,
                whatsapp,
                password
            });
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    
        return response.sendStatus(200);
    }
};
