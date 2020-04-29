exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name", 30).notNullable();
    table.string("email", 30).notNullable();
    table.string("password", 30).notNullable();
    table.enu("status", ["CONFIRMED", "CREATED"]).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
