 
 const mongoose = require("mongoose");
const { listingSchema } = require( "../schema" );
 const Schema = mongoose.Schema;

 const reviewSchema = new Schema({
    comment : String,
    rating : {
         type : Number ,
         min : 1 ,
         max : 5
    },
    createdAt : {
         type : Date ,
          default : Date.now()
    } ,
     author : {
           type : Schema.Types.ObjectId ,
           ref : "User" ,
     },
 });


  const review = mongoose.model('Review', reviewSchema);
 module.exports = review; 