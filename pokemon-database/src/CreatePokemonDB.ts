import * as sequelize from './postgres/InitializeDatabase';

export async function CreatePokemonDB(pokemon: sequelize.PokemonInfo) {

    try {
        await sequelize.Pokemon.create(pokemon);
    } catch (error: unknown) {
        console.log("Error in CreatePokemonDB()");
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}
