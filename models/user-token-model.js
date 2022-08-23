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
  },
  {
    timestamps: false,
  }
);

userModel.hasMany(tokenModel, {
  allowNull: false,
  foreignKey: "uid_id",
});

(async () => {
  // Пересоздаем таблицу в БД
  await sequelize.sync();
  // дальнейший код
})();

module.exports = { tokenModel, userModel };
