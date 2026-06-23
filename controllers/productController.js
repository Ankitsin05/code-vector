const Product = require("../models/Product");
const mongoose = require("mongoose");

const {
  encodeCursor,
  decodeCursor,
} = require("../utils/cursor");

const getProducts = async (req, res) => {
  try {
    let { limit = 20, cursor, category } = req.query;

    // Limit validation
    limit = parseInt(limit) || 20;
    limit = Math.min(limit, 100);

    if (limit < 1) {
      limit = 20;
    }

    let query = {};

    // Category filter
    if (category && category.trim()) {
      query.category = category.trim();
    }

    // Cursor Pagination
    if (cursor) {
      let decodedCursor;

      try {
        decodedCursor = decodeCursor(cursor);
      } catch {
        return res.status(400).json({
          message: "Invalid cursor",
        });
      }

      query.$or = [
        {
          createdAt: {
            $lt: new Date(decodedCursor.createdAt),
          },
        },
        {
          createdAt: new Date(
            decodedCursor.createdAt
          ),
          _id: {
            $lt: new mongoose.Types.ObjectId(
              decodedCursor.id
            ),
          },
        },
      ];
    }

    const products = await Product.find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit);

    let nextCursor = null;

    if (products.length > 0) {
      const lastProduct =
        products[products.length - 1];

      nextCursor =
        encodeCursor(lastProduct);
    }

    res.status(200).json({
      count: products.length,
      nextCursor,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getProducts,
};