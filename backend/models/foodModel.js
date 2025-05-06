// models/foodModel.js
import { cloudant, dbName } from '../config/db.js';

async function getAllFoods() {
  const response = await cloudant.postFind({
    db: dbName,
    selector: {} // ← remove filter for now
  });
  return response.result.docs;
}


async function addFood(foodData) {
  const newFood = { ...foodData, type: "food" };
  const response = await cloudant.postDocument({
    db: dbName,
    document: newFood,
  });
  return response.result;
}

// ES module export
export { getAllFoods, addFood };
