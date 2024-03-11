require("dotenv").config();

module.exports = {
  region: process.env.REGION,
  credentials: { 
      accessKeyId : process.env.SECRET_KEY_ID,
      secretAccessKey: process.env.SECRET_KEY,
  }
};