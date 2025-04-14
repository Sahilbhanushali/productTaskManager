const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/createproduct", (req, res) => {
  const { name, price, images } = req.body;
  db.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      const productId = result.insertId;
      const imageValues = images.map((url) => [productId, url]);

      db.query(
        "INSERT INTO product_images (product_id, image_url) VALUES ?",
        [imageValues],
        (err) => {
          if (err) return res.status(500).json({ error: err });
          res
            .status(201)
            .json({ message: "Product created successfully", productId });
        }
      );
    }
  );
});

router.get("/getproduct", (req, res) => {
  const query = `
    SELECT p.id, p.name, p.price, pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.deleted = 0
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const productsMap = {};
    results.forEach((row) => {
      if (!productsMap[row.id]) {
        productsMap[row.id] = {
          id: row.id,
          name: row.name,
          price: row.price,
          images: [],
        };
      }
      if (row.image_url) productsMap[row.id].images.push(row.image_url);
    });
    console.log(productsMap);
    res.json(Object.values(productsMap));
  });
});
router.get("/getproduct/:id", (req, res) => {
  const productId = req.params.id;
  const query = `
    SELECT p.id, p.name, p.price, pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.deleted = 0 and p.id = ${productId}
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    const productsMap = {};
    results.forEach((row) => {
      if (!productsMap[row.id]) {
        productsMap[row.id] = {
          id: row.id,
          name: row.name,
          price: row.price,
          images: [],
        };
      }
      if (row.image_url) productsMap[row.id].images.push(row.image_url);
    });

    res.json(Object.values(productsMap));
  });
});

router.put("/editproduct/:id", (req, res) => {
  const productId = req.params.id;
  const { name, price, images } = req.body;

  db.query(
    "UPDATE products SET name = ?, price = ? WHERE id = ?",
    [name, price, productId],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Product updated successfully" });
    }
  );
});

router.put("/deleteproduct/:id", (req, res) => {
  const productId = req.params.id;

  db.query(
    "UPDATE products SET deleted = 1 WHERE id = ?",
    [productId],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Product deleted successfully" });
    }
  );
});

module.exports = router;
