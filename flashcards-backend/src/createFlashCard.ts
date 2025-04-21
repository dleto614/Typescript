import { sequelize, Front, Back, FlashCardFront, FlashCardBack } from "./database/initSqlite";
import { CheckImage, FinalImages } from "./checkImage";
import { FlashCard } from "./types";
import "crypto";

const CheckText = async (text: string): Promise<boolean> => {
    if (!text) {
        return false;
    } else {
        return true;
    }
}

export const CreateCard = async (card: FlashCard) => {

    // Check if Text and Image are empty.
    // Either an image or text or both must be supplied as input.
    if (!await CheckText(card.FrontText) && card.FrontImage === null) {
        throw new Error("Front card cannot be empty");
    }

    if (!await CheckText(card.BackText) && card.BackImage === null) {
        throw new Error("Back card cannot be empty");
    }

    await CheckImage(card);
    const { frontImage, backImage, frontMimeType, backMimeType } = await FinalImages(card);

    try {
        const frontData: FlashCardFront = {
            id: crypto.randomUUID(),
            text: card.FrontText ?? null,
            image: frontImage,
            mime: frontMimeType ?? null
        };

        const backData: FlashCardBack = {
            id: crypto.randomUUID(),
            front_id: frontData.id,
            text: card.BackText ?? null,
            image: backImage,
            mime: backMimeType ?? null
        };

        await sequelize.authenticate();
        await sequelize.sync();

        await Front.create(frontData);
        await Back.create(backData);

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
}