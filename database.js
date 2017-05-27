const Sequelize = require('sequelize');

const database = new Sequelize('postgres://huntern:huntern@localhost:5432/huntern');

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

const Admin = database.define('admin', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Student = database.students('students', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

database.sync();

module.exports.Company = Company;
module.exports.Admin = Admin;
module.exports.Student = Student;
