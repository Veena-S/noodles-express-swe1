import express from 'express';
import { read } from './jsonFileStorage.js';

const PORT = 3004;
let recipeListByCategory = [];
const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));

// To create a virtual path prefix
// http://localhost:3004/static/style.css
// app.use('/static', express.static('public'));

const getAllRecipes = (request, response) => {
  read('data.json', (jsonObjectData) => {
    console.log('file read completed');
    // Create a category list and recipe list
    const uniqueListCategory = {};
    const listRecipeLabels = [];
    jsonObjectData.recipes.forEach((element) => {
      if (element.category) {
        uniqueListCategory[element.category] = ''; }
      if (element.label) {
        listRecipeLabels.push(element.label); }
    });
    const returnData = {
      categoryList: uniqueListCategory,
      recipeList: listRecipeLabels,
    };
    response.render('homePage', returnData);
    console.log('response send');
  });
};

const getRecipeByIndex = (request, response) => {
  read('data.json', (jsonObjectData) => {
    const countRecipes = jsonObjectData.recipes.length;
    console.log(`Count: ${countRecipes}`);
    const requestedIndex = request.params.index;
    if (requestedIndex >= countRecipes)
    {
      response.set(404).send(`Sorry, we cannot find that!. There are only ${countRecipes} recipes available.`);
      return;
    }
    console.log('jsonObjectData.recipes[request.index]: ', jsonObjectData.recipes[requestedIndex]);
    // response.send(jsonObjectData.recipes[requestedIndex]);
    response.render('recipeIndex', { data: jsonObjectData.recipes[requestedIndex] });
  });
};

const getRecipeByYield = (request, response) => {
  read('data.json', (jsonObjectData) => {
    const requestedYield = Number(request.params.index);
    console.log('requestedYield: ', requestedYield);
    // Filter out the recipes that are not having a yield field.
    const recipesWithYield = jsonObjectData.recipes.filter((element) => ('yield' in element));
    if (recipesWithYield === undefined || recipesWithYield === null
      || recipesWithYield.length === 0)
    {
      response.set(404).send('Sorry, we cannot find that!.');
      return;
    }
    console.log('recipesWithYield count: ', recipesWithYield.length);
    // Create the list of recipes that matches the specified yield value
    const responseRecipeList = [];
    recipesWithYield.forEach((element) => {
      console.log(Number(element.yield));
      if (Number(element.yield) === requestedYield)
      {
        console.log('Found matching element: ', element);
        responseRecipeList.push(element);
      }
    });
    console.log('responseRecipeList count: ', responseRecipeList.length);
    response.send(responseRecipeList);
  });
};

const getRecipeByCategory = (request, response) => {
  console.log('inside getRecipeByCategory');
  read('data.json', (jsonObjectData) => {
    console.log('file read completed');
    const requestedCategory = request.params.category.toLowerCase();
    // Create the list of recipes that matches the specified label
    recipeListByCategory = [];
    jsonObjectData.recipes.forEach((element) => {
      if (element.category && (element.category.toLowerCase() === requestedCategory)) {
        if (element.label)
        {
          recipeListByCategory.push(element.label);
        }
      }
    });
    console.log(recipeListByCategory);
    response.render('recipesCategory', { recipeList: recipeListByCategory });
  });
};

const getRecipesByLabel = (jsonObjectData) => {
  // Filter out the recipes that are not having a yield field.
  const recipesWithLabel = jsonObjectData.recipes.filter((element) => ('label' in element));
  if (recipesWithLabel === undefined || recipesWithLabel === null
      || recipesWithLabel.length === 0)
  {
    return null;
  }
  console.log('recipesWithLabel count: ', recipesWithLabel.length);
  return recipesWithLabel;
};

const getRecipeByCategoryIndex = (request, response) => {
  read('data.json', (jsonObjectData) => {
    // Get the category from recipeListByCategory
    console.log(request.params.index);
    const requestedRecipeLabel = recipeListByCategory[request.params.index];
    console.log(requestedRecipeLabel);
    let recipesWithLabel = getRecipesByLabel(jsonObjectData);
    if (recipesWithLabel === null)
    {
      response.set(404).send('Sorry, we cannot find that!.');
      return;
    }
    recipesWithLabel = jsonObjectData.recipes.filter((element) => (element.label
      === requestedRecipeLabel));
    response.render('categoryIndex', { recipeList: recipesWithLabel });
  });
};

const getRecipeByLabelUsingHyphen = (request, response) => {
  read('data.json', (jsonObjectData) => {
    const requestedLabel = `${request.params.label1} ${request.params.label2} ${request.params.label3}`;
    console.log('requestedLabel: ', requestedLabel);
    const recipesWithLabel = getRecipesByLabel(jsonObjectData);
    if (recipesWithLabel === null)
    {
      response.set(404).send('Sorry, we cannot find that!.');
      return;
    }
    // Create the list of recipes that matches the specified label
    const responseRecipeList = [];
    recipesWithLabel.forEach((element) => {
      if (element.label.toLowerCase() === requestedLabel)
      {
        console.log('Found matching element: ', element);
        responseRecipeList.push(element);
      }
    });
    console.log('responseRecipeList count: ', responseRecipeList.length);
    response.send(responseRecipeList);
  });
};

const getRecipeByLabelUsingRegEx = (request, response) => {
  read('data.json', (jsonObjectData) => {
    let requestedLabel = request.params.label;
    // Replace all the - in requested label
    requestedLabel = requestedLabel.replace(/-/g, ' ');
    console.log('requestedLabel: ', requestedLabel);
    // Filter out the recipes that are not having a yield field.
    const recipesWithLabel = jsonObjectData.recipes.filter((element) => ('label' in element));
    if (recipesWithLabel === undefined || recipesWithLabel === null
      || recipesWithLabel.length === 0)
    {
      response.set(404).send('Sorry, we cannot find that!.');
      return;
    }
    console.log('recipesWithLabel count: ', recipesWithLabel.length);

    // Create the list of recipes that matches the specified label
    const responseRecipeList = [];
    recipesWithLabel.forEach((element) => {
      if (element.label.toLowerCase() === requestedLabel)
      {
        console.log('Found matching element: ', element);
        responseRecipeList.push(element);
      }
    });
    console.log('responseRecipeList count: ', responseRecipeList.length);

    console.log();
    response.send(responseRecipeList);
  });
};

app.get('/', getAllRecipes);
app.get('/recipe/:index', getRecipeByIndex);
app.get('/category/:category', getRecipeByCategory);
app.get('/category/recipe/:index', getRecipeByCategoryIndex);
app.get('/yield/:index', getRecipeByYield);

// Reference: https://expressjs.com/th/guide/routing.html
// Since the hyphen (-) and the dot (.) are interpreted literally,
// they can be used along with route parameters
// for each words, add separate routes
app.get('/recipe-label/:label1-:label2-:label3', getRecipeByLabelUsingHyphen);

// // The above can be acheived by using regular expressions also
// app.get('/recipe-label/:label(/[a-z]{0,}-{0,}/gi)', getRecipeByLabelUsingRegEx);
// app.get('/recipe-label/:label', getRecipeByLabelUsingRegEx);

/**
 * // set up generic RegExp to test in .search() subsequently
    const labelRegex = new RegExp(labelExp, 'i');
    const filteredRecipesArray =
     allRecipesArray.filter((recipe) => recipe.label.search(labelRegex) !== -1);
 */

app.listen(PORT);
