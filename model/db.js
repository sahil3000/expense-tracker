const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = 'mongodb://admin_waysky:3Jte7v047q4BaaU6HRTY9@cluster0-shard-00-00.x4lja.mongodb.net:27017,cluster0-shard-00-01.x4lja.mongodb.net:27017,cluster0-shard-00-02.x4lja.mongodb.net:27017/MBVDB?ssl=true&replicaSet=atlas-10hbij-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err){
        console.log("Failed to Established Connection with MongoDB with Error:"+err);
        return;
    }
    console.log("Successfully Established Connection with MongoDB");
});
require('./userModel')
require('./categoryModel')
require('./transactionModel')
