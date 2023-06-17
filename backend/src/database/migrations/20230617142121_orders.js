/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('orders',function(table){
            table.increments('id').primary();
            table.string('user_id').notNullable();
            table.string('status').notNullable();
            table.string('value').notNullable();
            table.string('sizes_id').notNullable();
            table.string('batters_id').notNullable();
            table.string('fillings_id_1').notNullable();
            table.string('fillings_id_2');
            table.string('decoration').notNullable();
            table.string('order_date');
            table.string('delivery_date').notNullable();
            table.string('delivery_price'); // será adicionada na tabela assim que o status mudar
            table.boolean('pick_up').defaultTo(false);
            table.string('decoration_price');  // será adicionada na tabela assim que o status mudar
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
