const connection = require('../database/connections')

module.exports = {
    async send_values(request, response) {
        
        try {
            const sizes = await connection('sizes').select('*');
            const batters = await connection('batters').select('*');
            const fillings = await connection('fillings').select('*');
            const status = await connection('order_status').select('*');

            return response.json({
                sizes,
                batters,
                fillings,
                status
            });
        
        } catch(error) { 

            log.console(error);
            return response.json(error);

        }

    }
     
};