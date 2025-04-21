import { Front, Back } from "./database/initSqlite";
import { FrontResponse, BackResponse } from "./types";

const createValues = (data: { [key: string]: any }): { [key: string]: any } => {
    return {
        id: data.id,
        front_id: data.front_id,
        text: data.text,
        image: data.image,
        mime: data.mime,
    };
};

const CreateResponse = (frontValues: { [key: string]: any }, backValues: { [key: string]: any }): { front: FrontResponse, back: BackResponse } => {
    const frontResponse = {
        id: frontValues.id,
        text: frontValues.text ?? null,
        image: frontValues.image?.substring(0, 100) ?? null,
        mime: frontValues.mime ?? null
    };

    const backResponse = {
        id: backValues.id,
        front_id: backValues.front_id,
        text: backValues.text ?? null,
        image: backValues.image?.substring(0, 100) ?? null,
        mime: backValues.mime ?? null
    };


    return { front: frontResponse, back: backResponse };

}

export const ReadCardById = async (id: string) => {

    const back = await Back.findOne({
        where: {
            id: id
        },
        include: [{
            model: Front,
            as: "front"
        }]
    });

    if (back) {
        const front = await Front.findOne({
            where: {
                id: back.dataValues.front_id
            }
        });

        if (back && front) {
            const frontValues = createValues(front);
            const backValues = createValues(back);

            const response = CreateResponse(frontValues, backValues);

            return response;

        }
    } else {
        const back = await Back.findOne({
            where: {
                front_id: id
            },
            include: [{
                model: Front,
                as: "front"
            }]
        })

        if (back && back.dataValues.front_id) {
            const front = await Front.findOne({
                where: {
                    id: back.dataValues.front_id
                }
            });

            if (back && front) {
                const frontValues = createValues(front);
                const backValues = createValues(back);

                const response = CreateResponse(frontValues, backValues);

                return response;

            }
        }

    }
}

export const ReadCards = async () => {

    const backs = await Back.findAll({
        include: [{
            model: Front,
            as: "front"
        }]
    });

    const results = [];

    for (const back of backs) {
        const front = await Front.findByPk(back.dataValues.front_id);

        if (front && back) {
            const frontValues = createValues(front);
            const backValues = createValues(back);

            const response = CreateResponse(frontValues, backValues);

            results.push({ response });

        }

    }

    return results;
}