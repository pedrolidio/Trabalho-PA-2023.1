const connection = require('../database/connection');

module.exports = {
    async verifyEmailAvailability(request, response) {
        const available = request.isEmailAvailable;

        return response.json({ available });
    },

    async getOrderFormProps(request, response) {        
        try {
            const sizes = await connection('sizes').select('*');
            const batters = await connection('batters').select('*');
            const fillings = await connection('fillings').select('*');
            const addresses = await connection('addresses').select('id', 'street', 'number').where('user_id', request.userId);
            const unavailableOrderDates = await connection.raw('select delivery_date as date, count(*) as orders from orders group by delivery_date having orders > 3');  
            let unavailableDates = [];

            unavailableOrderDates.forEach(unavailable => {
                unavailableDates.push(unavailable.date);                
            });

            return response.json({
                sizes,
                batters,
                fillings,
                addresses,
                unavailableDates
            });
        
        } catch(error) { 

            console.log(error);
            return response.json(error);

        }
    }
};
