  const Listing = require("../models/listing");
  const {listingSchema} = require("../schema");
 const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
  // Creating geocoding cleint 
   const mapToken  = process.env.MAP_TOKEN;
   const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 

  module.exports.index = async(req,res) => {
          const allListings = await Listing.find({});
          res.render("./listings/index.ejs",{allListings});
           }; 
     
 module.exports.renderNewForm = async(req,res) => { 
    res.render("./listings/new.ejs");
          } 
module.exports.showListing = async (req,res) => {
    let {id} = req.params;
     const listing = await Listing.findById(id)
     .populate({path : "reviews" ,
       populate : {
          path : "author" ,
       } ,
     })
     .populate("owner");
      if(!listing) { 
     req.flash("error" ,"Listing you requested for does not exist");
      return  res.redirect("/listings");
      }
     res.render("./listings/show.ejs" , {listing});
}
// createListing function:
      module.exports.createListing = async(req, res, next) => {
   
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1 ,
            })
            .send();    
  
      let url = req.file.path;
      let filename = req.file.filename;
    
     if(!req.body.listing) {
       throw new ExpressError(400,"Send valid data for listing");
     }
      let result = listingSchema.validate(req.body);
       console.log(result);
         if(result.error) {
             throw new ExpressError(404,result.error);
         }
    const newListing =  new Listing(req.body.listing); 
     newListing.owner = req.user._id;
      newListing.image = {url,filename};
       newListing.geometry =  response.body.features[0].geometry;
     await newListing.save(); 
       req.flash("success" ,"New listing created!");
      res.redirect("/listings");
        }

  module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) { 
     req.flash("error" ,"Listing you requested for does not exist");
        return res.redirect("/listings");
                   }
          let originalImageUrl = listing.image.url;
          originalImageUrl.replace("/upload" ,"/upload/h_300,w_250");

            req.flash("success" ," listing Updated!"); 
       res.render("./listings/edit.ejs",{listing});
       
   }  
            module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have access to edit!");
        return res.redirect(`/listings/${id}`);
    }

    // Check if location is being updated
    const newLocation = req.body.listing.location;
    if (newLocation && newLocation !== listing.location) {
        // Geocode the new location
        let response = await geocodingClient
            .forwardGeocode({
                query: newLocation,
                limit: 1,
            })
            .send();
        if (response.body.features.length) {
            req.body.listing.geometry = response.body.features[0].geometry;
        }
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};


     module.exports.destroyListing = async (req,res) => {
        let {id} = req.params;
        let deleteListing = await Listing.findByIdAndDelete(id);
         console.log(deleteListing);
         req.flash("success" ," listing Deleted!"); 
          res.redirect("/listings");
           
       }

        module.exports.searchListing = async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim() === "") {
        req.flash("error", "Please enter a search term.");
        return res.redirect("/listings");
    }
    // Try to find by title or location (case-insensitive, exact match or partial)
    const listing = await Listing.findOne({
        $or: [
            { title: { $regex: `^${q}$`, $options: "i" } },
            { location: { $regex: `^${q}$`, $options: "i" } }
        ]
    });
    if (listing) {
        return res.redirect(`/listings/${listing._id}`);
    } else {
        req.flash("error", "No listing found with that name or location.");
        return res.redirect("/listings");
    }
};
