exports.up = function (knex) {
  return knex.schema.createTable("secure_codes", (table) => {
    table.increments("id").primary();
    table.string("secure_code").notNullable();
    table.integer("belongs_to").notNullable().unsigned();
    table.string("expires_at");
    table.timestamps(false, true);

    table.foreign("belongs_to").references("users.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("secure_codes");
};
