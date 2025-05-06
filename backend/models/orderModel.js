import { cloudant, dbName } from "../config/db.js";

export const createOrder = async (orderData) => {
  const newOrder = {
    ...orderData,
    type: "order",
    date: new Date(),
    status: "Food Processing",
    payment: orderData.payment || false,
  };
  const response = await cloudant.postDocument({
    db: dbName,
    document: newOrder
  });
  return response.result;
};

export const getOrdersByUser = async (userId) => {
  const response = await cloudant.postFind({
    db: dbName,
    selector: {
      type: "order",
      userId
    }
  });
  return response.result.docs;
};
