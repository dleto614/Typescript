import { Model, DataTypes, Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "sequelize.sqlite",
  logging: false,
});

export interface FlashCardFront {
  id: string;
  text?: string;
  image?: string | null;
  mime?: string | null;
}

export class Front extends Model<FlashCardFront> { }

Front.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    mime: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "front",
  }
);

export interface FlashCardBack {
  id: string;
  front_id: string;
  text?: string | null;
  image?: string | null;
  mime?: string | null;
}

export class Back extends Model<FlashCardBack> { }

Back.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    front_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Front,
        key: "id",
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mime: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "back",
  }
)

Front.hasOne(Back, {
  foreignKey: "front_id",
  onDelete: "CASCADE",
  sourceKey: "id",
  as: "back",
});

Back.belongsTo(Front, {
  foreignKey: "front_id",
  as: "front",
});

// Sync the models with the database
(async () => {
  try {
    await sequelize.sync();
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database & tables:", error);
  }
})();