const Sequelize = require('sequelize');

const database = new Sequelize('postgres://huntern:huntern@localhost:5432/kimmorsha');

const Company = database.define('companies', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  companyName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  companyAbout: {
    type: Sequelize.TEXT
  },
  location: {
    type: Sequelize.STRING
  },
  website: {
    type: Sequelize.STRING
  },
  number: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  program: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  }
},{
  timestamps:true
});

database.sync();

module.exports.Company = Company;
