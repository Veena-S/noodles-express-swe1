import express from 'express';
import { read } from './jsonFileStorage.js';

const PORT = 3004;
const app = express();

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
    response.send(jsonObjectData.recipes[requestedIndex]);
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

const getRecipeByLabelUsingHyphen = (request, response) => {
  read('data.json', (jsonObjectData) => {
    const requestedLabel = `${request.params.label1} ${request.params.label2} ${request.params.label3}`;
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

app.get('/recipe/:index', getRecipeByIndex);
app.get('/yield/:index', getRecipeByYield);

// Reference: https://expressjs.com/th/guide/routing.html
// Since the hyphen (-) and the dot (.) are interpreted literally,
// they can be used along with route parameters
// for each words, add separate routes
app.get('/recipe-label/:label1-:label2-:label3', getRecipeByLabelUsingHyphen);

// // The above can be acheived by using regular expressions also
// app.get('/recipe-label/:label(/[a-z]{0,}-{0,}/gi)', getRecipeByLabelUsingRegEx);
// app.get('/recipe-label/:label', getRecipeByLabelUsingRegEx);

app.listen(PORT);
