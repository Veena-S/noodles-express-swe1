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

app.get('/recipe/:index', getRecipeByIndex);

app.listen(PORT);
