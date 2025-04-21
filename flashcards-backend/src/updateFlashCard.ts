import { Front, Back } from "./database/initSqlite";

import { ReadCardById } from "./readFlashCard";
import { CheckImage, FinalImages } from "./checkImage";
import { UpdateFrontCard, UpdateBackCard } from "./types";

export const UpdateCard = async (id: string, card: any) => {
    
    await CheckImage(card);

    const { frontImage, backImage, frontMimeType, backMimeType } = await FinalImages(card);
    const response = await ReadCardById(id);

    if (response && response.front) {
        const frontUpdate: UpdateFrontCard = {
            text: card.FrontText ?? undefined,
            image: frontImage ?? undefined,
            mime: frontMimeType ?? undefined
        }
    
        await Front.update(frontUpdate, {
            where: {
                id: response.front.id
            }
        });
    }
    
    if(response && response.back) {
        const backUpdate: UpdateBackCard = {
            text: card.BackText ?? undefined,
            image: backImage ?? undefined,
            mime: backMimeType ?? undefined
        }
    
        await Back.update(backUpdate, {
            where: {
                id: response.back.id
            }
        });
    }
}