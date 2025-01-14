const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./models");
db.sequelize.sync();  // Sync models with the database

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// API routes
require("./routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
});
