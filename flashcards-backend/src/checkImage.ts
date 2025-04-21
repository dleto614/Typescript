import fs from "fs";
import * as MimeTypes from "mime-types";
import { FlashCard } from "./types";

const CheckPath = async (path: string): Promise<boolean> => {
    if (fs.existsSync(path)) {
        return true;
    } else {
        return false;
    }
}

const CheckSize = async (path: string): Promise<boolean> => {
    const imageSize = fs.statSync(path).size;

    if (imageSize > 1024 * 1024) {
        return false;
    } else {
        return true;
    }
}

const GetMimeType = async (path: string): Promise<string> => {
    const MimeType = MimeTypes.lookup(path);

    if (!MimeType) {
        return "";
    } else {
        return MimeType;
    }
}

const EncodeImage = async (image: string): Promise<null | string> => {
    if (!image) {
        return null;
    } else {
        const fileBuffer = await fs.promises.readFile(image);
        return fileBuffer.toString('base64');
    }
}

const ValidImageMimeType = async (mimeType: string): Promise<boolean> => {
    const imageRegex = /^image\/(jpeg|jpg|png|gif|bmp|svg|webp)$/i;

    if (imageRegex.test(mimeType)) {
        return true;
    } else {
        return false;
    }
}

export const FinalImages = async (card: FlashCard): Promise<{ frontImage: null | string | undefined, backImage: null | string | undefined, frontMimeType: null | string | undefined, backMimeType: null | string | undefined }> => {
    let frontImage: null | string | undefined;
    let backImage: null | string | undefined;

    let frontMimeType: null | string | undefined;
    let backMimeType: null | string | undefined;

    if (card.FrontImage !== null) {
        frontImage = await EncodeImage(card.FrontImage);
        frontMimeType = await GetMimeType(card.FrontImage);
    }

    if (card.BackImage !== null) {
        backImage = await EncodeImage(card.BackImage);
        backMimeType = await GetMimeType(card.BackImage);
    }

    return {
        frontImage,
        backImage,
        frontMimeType,
        backMimeType,
    };
}

export const CheckImage = async(card: FlashCard) => {
    // Check path for front and back image.
    if (card.FrontImage !== null && !await CheckPath(card.FrontImage)) {
        throw new Error("Front image does not exist");
    }

    if (card.BackImage !== null && !await CheckPath(card.BackImage)) {
        throw new Error("Back image does not exist");
    }

    // Check image size
    if (card.FrontImage !== null && !await CheckSize(card.FrontImage)) {
        throw new Error("Front image is too large. Must be less than 1MB.");
    }

    if (card.BackImage !== null && !await CheckSize(card.BackImage)) {
        throw new Error("Back image is too large. Must be less than 1MB.");
    }

    // Check image mime type.
    if (card.FrontImage !== null && (!await GetMimeType(card.FrontImage) || !await ValidImageMimeType(await GetMimeType(card.FrontImage)))) {
        throw new Error("Front image type is not supported");
    }

    if (card.BackImage !== null && (!await GetMimeType(card.BackImage) || !await ValidImageMimeType(await GetMimeType(card.BackImage)))) {
        throw new Error("Back image type is not supported");
    }

}
