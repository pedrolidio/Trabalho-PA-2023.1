/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('addresses', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
            table.string('postal_code').notNullable();
            table.string('street').notNullable();
            table.string('number').notNullable();
            table.string('complement')
            table.string('city').notNullable();
            table.string('state').notNullable();
            table.string('district').notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('addresses');
};
