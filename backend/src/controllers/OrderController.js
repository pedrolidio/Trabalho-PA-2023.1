const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { cake, delivery } = request.body;

        if(!cake.size_id || !cake.batter_id || !cake.filling1_id || !cake.decoration
            || typeof delivery.pick_up !== 'boolean' || !delivery.date)
            return response.status(400).json({ error: "Missing required fields" });

        if((!cake.filling2_id && cake.size_id >= 2) || (typeof delivery.address_id !== 'number' && !delivery.pick_up))
        {
            return response.status(400).json({ error: "Missing required fields" });
        }

        const date = new Date();
        const formattedDate = date.toLocaleDateString('pt-BR');

        const size = await connection('sizes').select('id', 'basePrice').where('id', cake.size_id).first();
        const batter = await connection('batters').select('id', 'basePrice').where('id', cake.batter_id).first();
        const filling1 = await connection('fillings').select('id', 'basePrice').where('id', cake.filling1_id).first();
        const filling2 = await connection('fillings').select('id', 'basePrice').where('id', cake.filling2_id).first();

        if(!size || !batter || !filling1 || (!filling2 && cake.size_id >= 2))
            return response.status(401).json({ error: "Invalid cake properties" });


        const address = delivery.address_id ? (
            await connection('addresses').select('id').where({
                id: delivery.address_id,
                user_id: request.userId
            }).first()) : (undefined);

        if(!address && !delivery.pick_up)
            return response.status(401).json({ error: "Invalid delivery address" });

        const cake_base_price = size.basePrice + batter.basePrice 
            + filling1.basePrice + (size.id >= 2 && filling1.id != filling2.id ? filling2.basePrice : 0);

        try{
            await connection('orders').insert({
                user_id: request.userId,
                size_id: cake.size_id,
                batter_id: cake.batter_id,
                filling_id_1: cake.filling1_id,
                filling_id_2: cake.size_id >= 2 ? cake.filling2_id : null,
                cake_base_price,
                decoration: cake.decoration,
                pick_up: delivery.pick_up, 
                address_id: !delivery.pick_up ? delivery.address_id : null,
                delivery_date: delivery.date,
                order_date: formattedDate,
                status_id: 1
            });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error creating order.' });
        }
        
        response.sendStatus(200)
    },

    async list_all_orders(request, response) {
        try{
            const { page = 1, limit = 10 } = request.query;
            const offset = (page - 1) * limit;

            const pending_orders = await connection('orders')
                .select('*')
                .whereIn('status_id', [ 1, 2 ])
                .limit(limit)
                .offset(offset);

            const status = await connection('order_status').select('*');

            const users = await connection('users').select('id', 'name', 'whatsapp');

            const addresses = await connection('addresses').select('*');

            return response.json({
                pending_orders,
                status,
                users,
                addresses
            });
        
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