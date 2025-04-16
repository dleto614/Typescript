import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import {
    CreateAllPokemon,
    CreatePokemonRegion,
    ReadPokemon,
    ReadPokemonRegion,
    DeletePokemonRegion,
    DeleteAllPokemon
} from './routes/pokemon';

// Initialize JSDoc options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pokemon Database API",
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

router.post("/create/all", CreateAllPokemon);
router.post("/create/region/:region", CreatePokemonRegion);

router.post("/pokemon/read/:pokemon", ReadPokemon);
router.post("/pokemon/read/region/:region", ReadPokemonRegion);

router.delete("/delete/region/:region", DeletePokemonRegion);
router.delete("/delete/all", DeleteAllPokemon);

app.use(express.json());

app.use("/api", router);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Welcome to the RESTful API!");
});

try {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
} catch (error: unknown) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}