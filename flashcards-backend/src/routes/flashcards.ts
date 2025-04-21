import express from "express";

import { CreateCard } from "../createFlashCard";
import { ReadCards, ReadCardById } from "../readFlashCard";
import { UpdateCard } from "../updateFlashCard";
import { DeleteFlashCards, DeleteById } from "../deleteFlashCard";

/**
 * @openapi
 * /api/create/flashcards:
 *   post:
 *     description: Create a flash card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FrontText:
 *                 type: string
 *                 description: The front text of the flash card
 *               FrontImage:
 *                 type: string
 *                 description: The front image of the flash card
 *               BackText:
 *                 type: string
 *                 description: The back text of the flash card
 *               BackImage:
 *                 type: string
 *                 description: The back image of the flash card
 *     responses:
 *       200:
 *         description: Flash card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Flash card created successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
export const CreateFlashCard = async (
    req: express.Request,
    res: express.Response
) => {
    const { FrontText = null, FrontImage = null, BackText = null, BackImage = null } = req.body;

    const card = {
        FrontText,
        FrontImage,
        BackText,
        BackImage
    };

    try {
        await CreateCard(card);
        res.status(200).json({ message: "Flash card created successfully" });
    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * @openapi
 * /api/read/flashcards:
 *   get:
 *     description: Get all flashcards
 *     responses:
 *       200:
 *         description: Flash cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   front:
 *                     type: object
 *                   back:
 *                     type: object
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */

export const ReadFlashCards = async (req: express.Request, res: express.Response) => {
    try {
        const cards = await ReadCards();
        res.status(200).json(cards);
    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * @openapi
 * /api/read/flashcard/{id}:
 *   post:
 *     description: Get a flashcard by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the flashcard to retrieve
 *     responses:
 *       200:
 *         description: Flashcard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 front:
 *                   type: object
 *                 back:
 *                   type: object
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
export const ReadFlashCardById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;

    console.log(id);

    try {
        const card = await ReadCardById(id);
        res.status(200).json(card);
    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * @openapi
 * /api/update/flashcard/{id}:
 *   put:
 *     description: Update a flashcard by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the flashcard to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FrontText:
 *                 type: string
 *                 description: The front text of the flashcard
 *               FrontImage:
 *                 type: string
 *                 description: The front image of the flashcard
 *               BackText:
 *                 type: string
 *                 description: The back text of the flashcard
 *               BackImage:
 *                 type: string
 *                 description: The back image of the flashcard
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Flashcard updated successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */

export const UpdateFlashCard = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const { FrontText = null, FrontImage = null, BackText = null, BackImage = null } = req.body;

    const card = {
        FrontText,
        FrontImage,
        BackText,
        BackImage
    };

    try {
        await UpdateCard(id, card);
        res.status(200).json({ message: "Flash card updated successfully" });
    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * @openapi
 * /api/delete/flashcards:
 *   delete:
 *     description: Delete all flashcards
 *     responses:
 *       200:
 *         description: Flashcards deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Flashcards deleted successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
export const DeleteAllFlashCards = async (req: express.Request, res: express.Response) => {
    try {
        await DeleteFlashCards();
        res.status(200).json({ message: "Flash cards deleted successfully" });
    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * @openapi
 * /api/delete/flashcard/{id}:
 *   delete:
 *     description: Delete a flashcard by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the flashcard to delete
 *     responses:
 *       200:
 *         description: Flashcard deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Flashcard deleted successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
export const DeleteFlashCardById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    try {
        await DeleteById(id);
        res.status(200).json({ message: "Flash card deleted successfully" });
    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}