import express from 'express';
import { sequelize, Pokemon, Region } from '../postgres/InitializeDatabase';
import * as scraper from '../scraper/scraper';

import 'sharp';
import sharp from 'sharp';

const imageBlobToBase64 = async (pokemon: Pokemon): Promise<object | null> => {
    const imageBlob = pokemon.dataValues.sprites;
    const imageData = imageBlob.toString('base64');

    const buffer = await sharp(Buffer.from(imageData, 'base64')).toFormat('jpeg').toBuffer();
    const base64Image = buffer.toString('base64');

    const finalPokemon = {
        id: pokemon.dataValues.id,
        name: pokemon.dataValues.name,
        type: pokemon.dataValues.types,
        image: base64Image,
    };

    return finalPokemon;

}

/**
 * @openapi
 * /api/delete/all:
 *   delete:
 *     summary: Delete all Pokemon
 *     description: Delete all Pokemon from the database
 *     responses:
 *       200:
 *         description: All Pokemon deleted
 *       400:
 *         description: Error while deleting all Pokemon
 */
export const DeleteAllPokemon = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const regions = await Region.findAll({
            include: [
                {
                    model: Pokemon,
                    as: 'pokemon',
                },
            ],
        });

        if (regions) {
            for (const region of regions) {
                await region.destroy();
            }
            res.status(200).json({ message: "All Pokemon and regions deleted" });
        } else {
            res.status(400).json({ message: "Error while deleting all Pokemon" });
        }
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * @openapi
 * /api/delete/region/{region}:
 *   delete:
 *     summary: Delete a Pokemon region
 *     description: Delete all Pokemon from a given region
 *     parameters:
 *       - in: path
 *         name: region
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the region to delete
 *     responses:
 *       200:
 *         description: Pokemon region deleted
 *       400:
 *         description: Region not found
 */
export const DeletePokemonRegion = async (
    req: express.Request,
    res: express.Response
) => {
    const region = await Region.findOne({
        where: {
            name: req.params.region,
        },
        include: [
            {
                model: Pokemon,
                as: 'pokemon',
            },
        ],
    });

    if (region) {
        await region.destroy();
        res.status(200).json({ message: "Pokemon region deleted" });
    } else {
        res.status(404).json({ message: "Region not found" });
    }

}

/**
 * @openapi
 * /api/pokemon/read/region/{region}:
 *   post:
 *     summary: Retrieve Pokemon region and all its Pokemon
 *     description: Returns a JSON object containing the requested region and all its Pokemon
 *     parameters:
 *       - in: path
 *         name: region
 *         schema:
 *           type: string
 *         required: true
 *         description: The region of the Pokemon
 *     responses:
 *       200:
 *         description: The Pokemon region and all its Pokemon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 pokemon:
 *                   type: array
 *       404:
 *         description: Could not get Pokemon from region
 */
export const ReadPokemonRegion = async (
    req: express.Request,
    res: express.Response
) => {

    const pokemons = await Region.findOne({
        where: {
            name: req.params.region,
        },
        include: [
            {
                model: Pokemon,
                as: 'pokemon',
            },
        ],
    });

    if (pokemons) {
        const pokemonArray = pokemons.get('pokemon') as Pokemon[];

        for (const key in pokemonArray) {
            const pokemon = pokemonArray[key];
            const finalPokemons = await imageBlobToBase64(pokemon);

            res.write(JSON.stringify(finalPokemons));
        }
        res.end();
    } else {
        res.status(404).json({ message: 'Could not get Pokémon from region' });
    }
}

/**
 * @openapi
 * /api/pokemon/read/{pokemon}:
 *   post:
 *     summary: Retrieve Pokemon information
 *     parameters:
 *       - name: pokemon
 *         in: path
 *         required: true
 *         description: Name of the Pokemon to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with Pokemon data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 image:
 *                   type: string
 *                   format: binary
 *                   contentMediaType: image/jpeg
 *       404:
 *         description: Pokemon not found
 */

export const ReadPokemon = async (
    req: express.Request,
    res: express.Response
) => {

    const pokemon = await Pokemon.findOne({
        where: {
            name: req.params.pokemon,
        }
    });

    if (pokemon) {
        try {
            const finalPokemon = await imageBlobToBase64(pokemon);
            res.status(200).json(finalPokemon);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    } else {
        res.status(404).json({ message: "Pokemon not found" });
    }
};

/**
 * @openapi
 * /api/create/region/{region}:
 *   post:
 *     summary: Create pokemon database for a specific region
 *     description: Creates a database of Pokemon for the specified region if the region is valid.
 *     parameters:
 *       - in: path
 *         name: region
 *         required: true
 *         description: The region for which to create the Pokemon database for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pokemon database created for region
 *       400:
 *         description: Invalid region
 */

export const CreatePokemonRegion = async (
    req: express.Request,
    res: express.Response
) => {
    const region = req.params.region;

    if (region.length != 0 && scraper.CheckRegionValid(region)) {
        await scraper.GetAllPokemon(region);
        // res.status(200).json({ message: "Pokemon database created for region:" + region });
    } else {
        res.status(400).json({ message: "Invalid region" });
    }

    res.status(200).json({ message: "Pokemon database created for region" });
    return;
}

/**
 * @openapi
 * /api/create/all:
 *   post:
 *     summary: Create pokemon database
 *     description: Create pokemon database
 *     responses:
 *       200:
 *         description: Pokemon database created
 *       400:
 *         description: Error occured while creating pokemon database
 */
export const CreateAllPokemon = async (
    req: express.Request,
    res: express.Response
) => {

    try {
        try {
            console.log("Creating database");
            await sequelize.authenticate();
            await sequelize.sync();
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
        }

        const regions = ["kanto", "johto", "hoenn", "sinnoh", "unova"];

        for (const region of regions) {
            if (region.length != 0 && scraper.CheckRegionValid(region)) {
                await scraper.GetAllPokemon(region);
            }
        }

        res.status(200).json({ message: "Pokemon database created for all regions" });
        return;

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
    }
};