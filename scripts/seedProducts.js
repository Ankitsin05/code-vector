const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { faker } = require("@faker-js/faker");

const Product = require("../models/Product");

dotenv.config();

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
  "Beauty",
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("MongoDB Connected");

    // yhaa kar diye Purane products delete
    await Product.deleteMany({});
    console.log("Old products deleted");

    const TOTAL_PRODUCTS = 200000;
    const BATCH_SIZE = 5000;

    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
      const products = [];

      for (
        let j = 0;
        j < BATCH_SIZE && i + j < TOTAL_PRODUCTS;
        j++
      ) {
        products.push({
          name: faker.commerce.productName(),
          category:
            categories[
              Math.floor(Math.random() * categories.length)
            ],
          price: Number(
            faker.commerce.price({
              min: 100,
              max: 100000,
            })
          ),
        });
      }

      await Product.insertMany(products);

      console.log(
        `${Math.min(i + BATCH_SIZE, TOTAL_PRODUCTS)} products inserted`
      );
    }

    console.log("✅ 200000 products seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();



// const count = await Product.countDocuments();
// console.log("Total Products:", count);