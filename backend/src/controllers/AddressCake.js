const connection = require('../database/connections')


module.exports = {
    async create_address(request, response) {
        
        try{
            const new_address = request.body;
            console.log(new_address)

            const inserted_address = await connection('address').insert(new_address);
                
            response.status(200).json({ message: 'Address inserted successfully' });
        
        } catch (error) {
            console.error(error);
            response.status(404).json({ error: 'Error inserting address.' });
        }
        
    },

    async list_all_address(request, response) {
        try{
            const all_address = await connection('address').select('*');

            return response.json(all_address);
        
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Error listing all address" });

        }
        
    },

    async list_address_user(request, response) {
        try{
            const user_id = request.params.id;
            
            console.log(user_id)

            const all_address = await connection('address')
                .select('*')
                .where('user_id', user_id);

            console.log(all_address)
            return response.json(all_address);
        
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Error listing all address by user" });

        }
        
    }
};