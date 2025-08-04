const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Cargar variables de entorno
require('dotenv').config();

const PORT = process.env.SERVER_PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';


const productList = fs.readFileSync("./mocks/productList.json");
const productDetail = fs.readFileSync("./mocks/productDetail.json");

const { products } = JSON.parse(productList);
const { details } = JSON.parse(productDetail);


app.use(cors({
  origin: CLIENT_URL
}))


app.get("/items", (req, res) => {

  const { search } = req.query;
  let results = products;

  if (search) {
    const term = search.toLowerCase();
 
    results = products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.categories.some((c) => c.toLowerCase().includes(term))
    );
  }


  if (results.length === 0) {
    return res.status(404).json({ error: "No se encontraron productos" });
  }

  res.json({"categories": results[0].categories, items:results});
});


app.get("/items/:id", (req, res) => {

  const id = req.params.id;
  const product = details.find((p) => p.item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product); 
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
