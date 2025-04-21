import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import {
    CreateFlashCard,
    ReadFlashCards,
    ReadFlashCardById,
    UpdateFlashCard,
    DeleteAllFlashCards,
    DeleteFlashCardById,
} from "./routes/flashcards";

// Initialize JSDoc options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Flash Cards",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

console.log("OpenAPI Specification: ", openapiSpecification);

// Initialize app and router.
const app = express();
const router = express.Router();

// Middleware to parse URL-encoded request bodies
router.use(express.urlencoded({ extended: true }));

// Middleware for swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());

router.post("/create/flashcards", CreateFlashCard);
router.post("/read/flashcard/:id", ReadFlashCardById);

router.get("/read/flashcards", ReadFlashCards);

router.put("/update/flashcard/:id", UpdateFlashCard);

router.delete("/delete/flashcards", DeleteAllFlashCards);
router.delete("/delete/flashcard/:id", DeleteFlashCardById);

app.use("/api", router);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Welcome to the RESTful API!");
});

try {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
} catch (err: any) {
  console.log(err.message);
}