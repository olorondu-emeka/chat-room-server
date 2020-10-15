import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { config } from 'dotenv';
import * as dbData from '../config/config';

config();

const base = path.basename(__filename);
const env = process.env.NODE_ENV;
const db = {};
const dbUrl = dbData[env];
const sequelize = new Sequelize(process.env[dbUrl.use_env_variable], dbUrl);
fs.readdirSync(__dirname)
  .filter(
    (file) => file.indexOf('.') !== 0 && file !== base && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
