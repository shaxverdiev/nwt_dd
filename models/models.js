// если в будущем добавить миграции, то они не удалят существующие таблицы
// во первых потому что они заранее прописаны в дректории models
// во вторых пока в логике самой миграции не предусмотренно удаление начальных страниц, они не будут удалены

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const userModel = sequelize.define(
  "user",
  {
    uid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
      validate: {
        notNull: true,
        isUUID: 4,
      },
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      require: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      require: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      require: true,
      allowNull: false,
      defaultValue: 'USER',
    }
  },
  {
    timestamps: false,
  }
);

const tokenModel = sequelize.define(
  "token",
  {
    refreshToken: {
      type: DataTypes.STRING,
      require: true,
      allowNull: false,
    },
    user_uid: {
      type: DataTypes.UUID,
      allowNull: false,
      require: true,
      unique: true,
      references: {
        model: userModel,
        key: "uid",
      },
    },
  },
  {
    timestamps: false,
  }
);

const keysModel = sequelize.define(
  "keys", 
  {
    access_key: {
      type: DataTypes.STRING,
      require: true,
      unique: true,
      defaultValue: "USER"
    },
    user_uid: {
      type: DataTypes.UUID,
      allowNull: true,
      require: true,
      unique: true,
      references: {
        model: userModel,
        key: "uid"
      }
    }
  }
);


(async () => {
  // Пересоздаем таблицу в БД
  await sequelize.sync();
  // дальнейший код
})();

module.exports = { tokenModel, userModel, keysModel};
