'use strict';
const { config } = require('dotenv');

config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbData = require('../config/config');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};
const dbUrl = dbData[env];
const sequelize = new Sequelize(process.env[dbUrl.use_env_variable], dbUrl);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
