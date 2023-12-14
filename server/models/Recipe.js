const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
     name:{
        type:String,
        require : 'This field is requied'
     },
     description:{
        type:String,
        require : 'This field is requied'
     },
     ingredients:{
        type:Array,
        require : 'This field is requied'
     },
     category:{
        type:String,
        enum : ['Thai', 'Indian', 'Chinese', 'Mexican', 'American', 'Spanish'],
        require : 'This field is requied'
     },
     image:{
        type: String,
        require : 'This field is requied'
     }
});

recipeSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);