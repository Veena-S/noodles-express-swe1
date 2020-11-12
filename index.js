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

app.get('/recipe/:index', getRecipeByIndex);
app.get('/yield/:index', getRecipeByYield);

app.listen(PORT);
