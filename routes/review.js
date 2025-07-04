
  const express = require('express');
   const router = express.Router({mergeParams : true});
   const ExpressError = require("../utils/ExpressError.js");
   const wrapAsync = require("../utils/wrapAsync.js");
   const Review = require('../models/review.js');
   const Listing = require("../models/listing.js");
   const {reviewSchema} = require("../schema.js"); 
const { isLoggedIn } = require( '../middleware.js' );
   //const validateReview = require("../middleware.js");
    const  reviewController = require("../controller/review.js");

    const validateReview = (req,res,next) => {
      let {error} =   reviewSchema.validate(req.body);
       if(error ) {
         let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400,errMsg);
         } else {
            next(); 
         } 
   };

    // Review  POST route
    router.post("/" ,isLoggedIn , validateReview ,wrapAsync(reviewController.createReview));

 //Review DELETE route
     router.delete("/:reviewId" , wrapAsync(reviewController.destroyReview));  

   module.exports = router;
