export interface FlashCard {
    FrontText: string,
    FrontImage: string,
    BackText: string,
    BackImage: string
}

export interface FrontResponse {
    id: string;
    text?: string | null;
    image?: string | null;
    mime?: string | null;
}

export interface BackResponse {
    id: string;
    front_id: string;
    text?: string | null;
    image?: string | null;
    mime?: string | null;
}

export interface UpdateFrontCard {
    text?: string;
    image?: string;
    mime?: string;
}

export interface UpdateBackCard {
    text?: string;
    image?: string;
    mime?: string;
}