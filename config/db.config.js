// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "123456",  // Use your actual password here
//     DB: "newConnection",
//     dialect: "mysql",
//   };
  
 

require("dotenv").config(); // Load environment variables

module.exports = {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "mysql",
};
