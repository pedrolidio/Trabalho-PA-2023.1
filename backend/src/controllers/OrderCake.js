const dayjs = require('dayjs');
const connection = require('../database/connections')


module.exports = {
    async create_order(request, response) {
        
        try{
            const new_order = request.body;
            const formattedDate = dayjs().format('DD/MM/YYYY');
            console.log(new_order)

            const inserted_order = await connection('orders').insert({
                ...new_order, // operador '...' adiciona todas os valores do objeto new_order
                order_date: formattedDate
            });
                
            response.status(200).json({ message: 'Order inserted successfully' });
        
        } catch (error) {
            console.error(error);
            response.status(404).json({ error: 'Error inserting order.' });
        }
        
    },

    async list_all_orders(request, response) {
        try{
            const { page = 1, limit = 5 } = request.query;
            const offset = (page - 1) * limit;

            const all_orders = await connection('orders')
                .select('*')
                .whereIn('status',['Acomplished','Preparing'])
                .limit(limit)
                .offset(offset);

            return response.json(all_orders);
        
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Error listing all orders" });

        }
        
    },

    async list_user(request, response) {
        try{
            const user_id = request.params.id;
            const { page = 1, limit = 5 } = request.query;
            const offset = (page - 1) * limit;
            
            console.log(user_id)

            const all_orders = await connection('orders')
                .select('*')
                .where('user_id', user_id)
                .limit(limit)
                .offset(offset);

            console.log(all_orders)
            return response.json(all_orders);
        
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Error listing all orders by user" });

        }
        
    },

    async update_order(request, response) {

        try{
            const id = request.params.id;

            const description = request.body.description;
            const decoration_price = request.body.decoration_price;
            const delivery_price = request.body.delivery_price;
            const delivery_date = request.body.delivery_date;

            const data = {
                "status": "Preparing",
                "description": description,
                "decoration_price": decoration_price,
                "delivery_date": delivery_date,
                "delivery_price": delivery_price,
            };
            
            console.log(id);
        
            const incident = await connection('orders')
                .where('id',id)
                .update(data);
            
            response.status(200).json({ message: 'Order status updated successfully.' });
        
        } catch (error) {
            console.error(error);
            response.status(404).json({ error: 'Error updating order status.' });
        }
        
    }
};