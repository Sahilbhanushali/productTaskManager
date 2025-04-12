const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/addcart/:id", (req, res) => {
  const productId = req.params.id;
  console.log(`Adding product with ID ${productId} to cart`);
  db.query("INSERT INTO cart (product_id) VALUES (?)", [productId], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Product added to cart" });
  });
});

router.get("/cartproducts", (req, res) => {
  const query = `
    SELECT c.id AS cart_id, p.id AS product_id, p.name, p.price, pi.image_url
    FROM cart c
    JOIN products p ON c.product_id = p.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const cartMap = {};

    results.forEach((row) => {
      if (!cartMap[row.cart_id]) {
        cartMap[row.cart_id] = {
          cart_id: row.cart_id,
          product_id: row.product_id,
          name: row.name,
          price: row.price,
          images: [],
        };
      }
      if (row.image_url) cartMap[row.cart_id].images.push(row.image_url);
    });

    res.json(Object.values(cartMap));
  });
});

module.exports = router;
