const Product = require("../models/product");
const mongoose = require("mongoose");
const encodeCursor = (product) => {

  return Buffer.from(
    JSON.stringify({
      createdAt: product.createdAt,
      id: product._id,
    })
  ).toString("base64");
};

const decodeCursor = (cursor) => {
  return JSON.parse(
    Buffer.from(cursor, "base64").toString()
  );
};

module.exports = {
  encodeCursor,
  decodeCursor,
};