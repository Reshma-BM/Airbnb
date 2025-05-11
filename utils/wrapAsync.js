module.exports = (fn) => {
     return (req,res,next) => {
         fn(req,res,next).catch(next);
     };
};
//can use(create route) this in async fucntions by replacing try-catch 