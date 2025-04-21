import { Back, Front, sequelize } from "./database/initSqlite";

export const DeleteFlashCards = async () => {
    await Front.destroy({
        where: {}

    });

}

export const DeleteById = async (id: string) => {
    await Front.destroy({
        where: {
            id: id
        }
    });
}