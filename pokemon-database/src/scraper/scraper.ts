import { PokemonInfo, Region } from '../postgres/InitializeDatabase';
import { CreatePokemonDB } from '../CreatePokemonDB';

import { randomUUID } from 'crypto';

// Fetch region using PokeAPI

const getPokedexRegionEntries = async (region: string) => {
    console.log(`Fetching region: ${region}`);
    const url = `https://pokeapi.co/api/v2/region/${region}`;
    const response = await fetch(url);
    const data = await response.json();
    const pokedex = data.pokedexes[0];

    return pokedex;
}

const fetchRegion = async (pokedex: string) => {
    const response = await fetch(pokedex);
    const data = await response.json();

    return data;
}

export const getImage = async (url: string): Promise<Buffer> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
}

const getPokemonInfo = async (data: object, region: Region): Promise<object | undefined> => {
    if (Object.keys(data).length == 0) {
        console.log("No results in getPokemonInfo()");

        return;
    }

    for (let i = 0; i < Object.keys(data).length; i++) {
        const url = Object.values(data)[i].pokemon_species.url;
        const getFinalUrl = await fetchPokemonData(url);

        // Dumbfuck didn't put the Pokemon's type in the endpoint above so I had to pass the endpoint I needed to get all the info.
        const pokemon = await fetchPokemonData(getFinalUrl.varieties[0].pokemon.url);

        let types: string[] = [];

        if (pokemon.types.length == 2) {
            types = [pokemon.types[0].type.name, pokemon.types[1].type.name];

        } else {
            types = [pokemon.types[0].type.name];

        }

        const finalTypes = types.join(', ');

        const image = await getImage(pokemon.sprites.front_default);

        const info: PokemonInfo = {
            id: randomUUID(),
            region_id: region.dataValues.id,
            pokedex: pokemon.id,
            name: pokemon.name,
            types: finalTypes,
            sprites: image,
        }

        try {
            await CreatePokemonDB(info);
        } catch (error: unknown) {
            console.log("Error in scraper");
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }
}

const GetOrCreateRegion = async (region: string): Promise<Region> => {
    console.log("Checking if region exists");
    const existing = await Region.findOne({
        where: {
            name: region,
        },
    });

    if(existing) {
        return existing;
    } else {
        const newRegion = await Region.create({
            id: randomUUID(),
            name: region,
        });
        return newRegion;
    }
};

const fetchPokemonData = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const GetAllPokemon = async(region: string) => {
    const getRegion: Region = await GetOrCreateRegion(region);
    const getEntries = await getPokedexRegionEntries(region);

    if (getEntries) {
        const data = await fetchRegion(getEntries.url);
        await getPokemonInfo(data.pokemon_entries, getRegion);
    }
}

export const CheckRegionValid = (region: string): boolean => {

    // Removed kalos, galar, etc since they have seperate areas within the regions for pokedex entries
    // Just wasn't feeling coding all that right now.
    const regions = [ "kanto", "johto", "hoenn", "sinnoh", "unova" ];

    if(regions.includes(region)) {
        return true;
    } else {
        return false;
    }
}

export const GetPokemon = async (region: string) => {

    if(region.length != 0 && CheckRegionValid(region)) {
        await GetAllPokemon(region);
    }
}