import * as fs from 'fs'
import * as path from 'path'
import {Sequelize} from "sequelize";

import {aliases} from './aliases'
import {relations} from "./relations";

// const {
//   databaseName,
//   username,
//   password,
//   host
// } = require('../../utils/config');
const data =  {
  databaseName: 'test',
  username : 'postgres',
  password : '12321',
  host:'127.0.0.1'
} ;

const basename = path.basename(__filename);
const db:any = {
  aliases
};


const sequelize:any = new Sequelize("test", "postgres", "12321", {
  host: "127.0.0.1",
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

fs.readdirSync(`${__dirname}/sources`)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model:any = sequelize.import(path.join(__dirname, 'sources', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

relations(db);

export {
  db as Model
}


