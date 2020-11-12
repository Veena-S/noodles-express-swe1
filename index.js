import express from 'express';
import { read } from './jsonFileStorage.js';

const PORT = 3004;
const app = express();

const getRecipeByIndex = (request, response) => {
  read('data.json', (jsonObjectData) => {
    const countRecipes = jsonObjectData.recipes.length;
    console.log(`Count: ${countRecipes}`);
    if (request.index >= countRecipes)
    {
      response.send(`Invalid index. There are only ${countRecipes} recipes available.`);
      return;
    }
    console.log('jsonObjectData.recipes[request.index]: ', jsonObjectData.recipes[request.params.index]);
    response.send(jsonObjectData.recipes[request.params.index]);
  });
};

app.get('/recipe/:index', getRecipeByIndex);

app.listen(PORT);
