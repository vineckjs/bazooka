/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('products', (table) => {
    table.string('id').primary();
    table.string('barcode').notNullable().unique().primary();
    table.string('thumbnail');
    table.string('name').notNullable();
    table.text('description');
    table.text('full_description');
    table.string('brand_name');
    table.float('net_weight');
    table.float('gross_weight');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .defaultTo(knex.fn.now())
      .onUpdate(knex.fn.now());
    table.timestamp('deleted_at');
    table.float('avg_price');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('products');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function () {};
