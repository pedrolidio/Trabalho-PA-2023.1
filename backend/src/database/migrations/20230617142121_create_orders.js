/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('orders',function(table){
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
            table.integer('status_id').unsigned().notNullable().references('id').inTable('order_status');
            table.integer('cake_base_price').notNullable().unsigned();;
            table.integer('size_id').notNullable().unsigned().references('id').inTable('sizes');
            table.integer('batter_id').notNullable().unsigned().references('id').inTable('batters');
            table.integer('filling_id_1').notNullable().unsigned().references('id').inTable('fillings');
            table.integer('filling_id_2').unsigned().references('id').inTable('fillings');
            table.string('decoration').notNullable();
            table.string('order_date').notNullable();
            table.string('delivery_date').notNullable();
            table.string('delivery_price'); // será adicionada na tabela assim que o status mudar
            table.integer('address_id').unsigned().references('id').inTable('addresses');
            table.boolean('pick_up').notNullable();
            table.integer('decoration_price').unsigned();  // será adicionada na tabela assim que o status mudar
            table.string('description'); // será adicionada na tabela assim que o status mudar            
            })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('orders');
};
