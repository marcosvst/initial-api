// Generic Imports
const express = require("express");
const bodyParser = require("body-parser");
const environment = process.env.ENVIRONMENT || "development";
require("dotenv").config();

// Objection JS imports
const knexConfig = require("../knexfile")[environment];
const Knex = require("knex");
const { Model } = require("objection");

// Routes imports
const apiRoutes = require("../src/routes/api.routes");
const usersRoutes = require("../src/routes/users.routes");

// App init
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database settings
const knex = Knex(knexConfig);
Model.knex(knex);

// Routes
app.use("/api", apiRoutes);
app.use("/users", usersRoutes);

module.exports = app;
