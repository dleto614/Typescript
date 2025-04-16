import { DataTypes, Model, Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Passw0rd!',
    database: 'pokemon',
    logging: false
});

export interface RegionAttributes {
    id: string;
    name: string;
}

export class Region extends Model<RegionAttributes> { }

Region.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Region",
        tableName: "regions",
    }
);

export interface PokemonInfo {
    id: string;
    region_id: string;
    pokedex: string;
    name: string;
    types: string;
    sprites: Buffer;
}

export class Pokemon extends Model<PokemonInfo> { }

Pokemon.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        region_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Region,
                key: "id",
            },
        },
        pokedex: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        types: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sprites: {
            type: DataTypes.BLOB,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "Pokemon",
        tableName: "pokemon",
    }
);

Region.hasMany(Pokemon, {
    foreignKey: "region_id",
    onDelete: "CASCADE",
    sourceKey: "id",
    as: "pokemon",
});

Pokemon.belongsTo(Region, {
    foreignKey: "region_id",
    as: "regions",
});

// Sync the models with the database
(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database & tables created!");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error creating database & tables:", error.message);
        }
    }
})();