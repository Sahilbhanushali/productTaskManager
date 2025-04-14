const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
require("dotenv").config();

require("./db");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static("public/uploads"));
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
