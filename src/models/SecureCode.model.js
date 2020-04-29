const { Model } = require("objection");

class SecureCode extends Model {
  // Table name
  static get tableName() {
    return "secure_codes";
  }

  // PK name
  static get idColumn() {
    return "id";
  }

  // Schema
  static get jsonSchema() {
    return {
      type: "object",
      required: ["belongs_to"],
      properties: {
        id: { type: "integer" },
        secure_code: { type: "string" },
        belongs_to: { type: "integer" },
        expires_at: { type: "date" },
      },
    };
  }
}

module.exports = SecureCode;
