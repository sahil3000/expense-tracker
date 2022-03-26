const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = 'yourMongoDbAddress';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err){
        console.log("Failed to Established Connection with MongoDB with Error:"+err);
        return;
    }
    console.log("Successfully Established Connection with MongoDB");
});
require('./userModel')
