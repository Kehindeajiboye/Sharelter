require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
      contact:
      {
        name: "SHARELTER",
        email: "ajiboyekehinde194@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  apis: ['./src/routes/*.js'], // files containing annotations as above
};
const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("WELCOME TO SHARELTER");
});

app.use("/api/listings", require("./src/routes/listingRoutes"));

app.use("/api/admin/listings", require("./src/routes/adminListingRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});