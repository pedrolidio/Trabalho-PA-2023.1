const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { postal_code, street, number, complement, city, state } = request.body;

        if(!postal_code || !street || !number || !city || !state) {
            return response.status(400).json({ error: "Missing required fields" });
        }

        try {
            await connection('addresses').insert({
                user_id: request.userId,
                postal_code,
                street,
                number,
                complement,
                city,
                state
            });    
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error inserting address.' });
        }
        
        response.sendStatus(200);
    },

    async list_all_address(request, response) {
        try{
            const all_address = await connection('addresses').select('*');

            return response.json(all_address);
        
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Error listing all address" });

        }
        
    },

    async getAddressesByUser(request, response) {
        let addresses = [];

        try{
            addresses = await connection('addresses')
                .select('*')
                .where('user_id', request.userId);        
        } catch (error) {
            return response.status(500).json({ error: "Error listing all address by user" });

        }
        
        return response.json(addresses);
    }
};