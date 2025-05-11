  const Listing = require("../models/listing");
  const Review = require("../models/review");
 
 
 module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
     newReview.author = req.user._id;
         console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" ,"New review created!");  
    res.redirect(`/listings/${listing._id}`);    
}
 module.exports.destroyReview = async(req,res) => {
      let listing = await Listing.findById(req.params.id);
      //console.log("DELETE route hit", req.params);
    let {id,reviewId} = req.params;  
         if (!review.author.equals(req.user._id)) {
            req.flash("error", "You do not have permission to delete this review.");
            return res.redirect(`/listings/${id}`);
        }
    await Listing.findByIdAndUpdate(id,{$pull : { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${listing._id}`);    
} 