require('../models/database');
const Category =require('../models/Category');
const Recipe =require('../models/Recipe');

// GET 
// homeage
exports.homepage = async (req, res)=>{

    try{
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest =await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        const thai = await Recipe.find({"category":'Thai'}).limit(limitNumber);
        const american = await Recipe.find({"category":'American'}).limit(limitNumber);
        // const chinese = await Recipe.find({"category":'Chinese'}).limit(limitNumber);
        // const indian = await Recipe.find({"category":'Indian'}).limit(limitNumber);
        // const mexican = await Recipe.find({"category":'Mexican'}).limit(limitNumber);
        // const spanish = await Recipe.find({"category":'Spanish'}).limit(limitNumber);

        const food = {latest, thai, american };

        res.render('index',{title: 'Blog - Home', categories, food});
    }
    catch(err){
        res.status(500).send({message: err.message || "Error Occured!"});
    }
}


// GET 
// Categories
exports.exploreCategories = async (req, res)=>{

    try{
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories',{title: 'Blog - Home - Categories', categories});
    }
    catch(err){
        res.status(500).send({message: err.message || "Error Occured!"});
    }
}

// GET 
// Recipe
exports.exploreRecipe = async(req, res) => {
    try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

// GET 
// Categories Id
exports.exploreCategoriesByID = async (req, res)=>{

    try{
        let categoryId =req.params.id;
        const limitNumber = 20;
        const categoryByID = await Recipe.find({ 'category':categoryId }).limit(limitNumber);
        res.render('categories',{title: 'Blog - Home - Categories', categoryByID});
    }
    catch(err){
        res.status(500).send({message: err.message || "Error Occured!"});
    }
}

//Post search

exports.searchRecipe =async(req,res)=>{
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'Cooking Blog - Search', recipe } );
      } catch (error) {
        res.satus(500).send({message: error.message || "Error Occured" });
      }
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  /**
 * GET /explore-random
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  }

  /**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj } );
  }

  exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
      
      await newRecipe.save();
  
      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/submit-recipe');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-recipe');
    }
  }


exports.contact = async (req, res)=>{
  res.end("comming soon..!");
}
exports.about = async (req, res)=>{
  res.end("comming soon..!");
}








/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('errrrrrrrrrrrrrr ', + error)
//   }
// }

// insertDymmyCategoryData();

// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Veggie Pad Thai",
//         "description": "A delightful vegetarian twist on the classic Pad Thai. Packed with colorful veggies and the perfect balance of sweet, salty, and tangy flavors.",
//         "email": "veggiepadthai@email.com",
//         "ingredients": [
//           "200g rice noodles",
//           "1 cup bean sprouts",
//           "1 red bell pepper, thinly sliced",
//           "1 carrot, julienned"
//         ],
//         "category": "Thai",
//         "image": "veggie-pad-thai.jpg"
//       },
//       {
//         "name": "Tom Daley's Special Smoothie",
//         "description": "Olympic-inspired smoothie crafted by Tom Daley. A refreshing blend of tropical fruits and Greek yogurt for a healthy start to your day.",
//         "email": "tomdaleysmoothie@email.com",
//         "ingredients": [
//           "1 banana",
//           "1/2 cup pineapple chunks",
//           "1/2 cup mango slices",
//           "1/2 cup Greek yogurt"
//         ],
//         "category": "American", 
//         "image": "tom-daley.jpg"
//       },
//       {
//         "name": "Thai-Style Mussels in Lemongrass Broth",
//         "description": "Mussels infused with Thai flavors in a lemongrass-infused broth. A taste of Thailand in every bite!",
//         "email": "thaistylemussels@email.com",
//         "ingredients": [
//           "1 kg fresh mussels",
//           "2 stalks lemongrass, bruised",
//           "3 kaffir lime leaves",
//           "1 red chili, sliced"
//         ],
//         "category": "Thai",
//         "image": "thai-style-mussels.jpg"
//       },
//       {
//         "name": "Chinese Steak and Tofu Stew",
//         "description": "Hearty Chinese stew combining succulent steak, tofu, and a rich soy-based broth. A comforting dish perfect for chilly evenings.",
//         "email": "chinesestew@email.com",
//         "ingredients": [
//           "500g beef sirloin, sliced",
//           "300g firm tofu, cubed",
//           "2 cups bok choy, chopped",
//           "4 cloves garlic, minced"
//         ],
//         "category": "Chinese",
//         "image": "chinese-steak-tofu-stew.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
