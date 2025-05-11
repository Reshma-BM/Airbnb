 const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const monog_url = "mongodb://127.0.0.1:27017/wonderlust";
  main().then(()=> {
     console.log("connected to DB");
  }).catch((err) => {
      console.log(err);
  })

  async function main() {
     await mongoose.connect(monog_url);
  }
   const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj,owner : '6817a49c7df78d3af1ec8928'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
   };

    initDB();

