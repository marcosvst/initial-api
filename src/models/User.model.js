const { Model } = require("objection");

class Users extends Model {
  // Table name
  static get tableName() {
    return "users";
  }

  // PK name
  static get idColumn() {
    return "id";
  }

  // Schema
  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 3, maxLength: 30 },
        email: { type: "string", format: "email" },
        password: { type: "string" },
      },
    };
  }

  // Relation
  static get relationMappings() {
    // Model imports
    // const Spot = require("../models/Spot.model");
    const SecureCode = require("./SecureCode.model");

    return {
      //   spots: {
      //     relation: Model.HasManyRelation,
      //     modelClass: Spot,
      //     join: {
      //       from: "users.id",
      //       to: "spots.created_by",
      //     },
      //   },
      secure_code: {
        relation: Model.HasOneRelation,
        modelClass: SecureCode,
        join: {
          from: "users.id",
          to: "secure_codes.belongs_to",
        },
      },
    };
  }
}

module.exports = Users;
