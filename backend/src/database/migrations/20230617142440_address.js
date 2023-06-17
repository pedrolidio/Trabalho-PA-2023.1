/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('address', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.string('cep').notNullable();
            table.string('street').notNullable();
            table.string('number').notNullable();
            table.string('complements').notNullable();
            table.string('city').notNullable();
            table.string('state').notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('address');
};
