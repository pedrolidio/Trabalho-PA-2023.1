/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('sizes',function(table){
            table.increments('id').primary;
            table.string('description').notNullable();
            table.integer('basePrice').notNullable().unsigned();
        });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('sizes');  
};