const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a Category Name'],
    },
    image:{
        type:String,
        required:[true,'This is Required.'],
    }

});

module.exports = mongoose.model('Category', categorySchema);