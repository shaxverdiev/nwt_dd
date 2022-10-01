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
      defaultValue: "USER",
    },
  },
  {
    timestamps: false,
  }
);

const keyModel = sequelize.define("keys", {
  access_key: {
    type: DataTypes.STRING,
    require: true,
    unique: true,
    defaultValue: "USER",
  },
  user_uid: {
    type: DataTypes.UUID,
    allowNull: true,
    require: true,
    unique: true,
    references: {
      model: userModel,
      key: "uid",
    },
  },
});

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

const fileModel = sequelize.define(
  "file",
  {
    name: {
      type: DataTypes.STRING,
      require: true,
    },
    typefile: {
      type: DataTypes.STRING,
      require: true,
    },
    size: { type: DataTypes.INTEGER, defaultValue: 0 },
    path: { type: DataTypes.STRING, defaultValue: "" },
    user_uid: {
      type: DataTypes.UUID,
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

const postModel = sequelize.define(
  "post",
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   require: true,
    //   primaryKey: true,
    // },
    title: {  
      type: DataTypes.STRING,
      require: true,
    },
    contentPost: {
      type: DataTypes.TEXT,
      require: true,
    },
    user_id: {
      type: DataTypes.UUID,
      require: true,
      references: {
        model: userModel,
        key: "uid",
      },
    }
  },
  {
    timestamps: false,
  }
);

const commentModel = sequelize.define(
  "comment",
  {
    contentComment: {
      type: DataTypes.STRING,
      allowNull: false,
    },  
    user_id: {
      type: DataTypes.UUID,
      require: true,
      references: {
        model: userModel,
        key: "uid",
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      require: true,
      references: {
        model: postModel,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  userModel,
  fileModel,
  tokenModel,
  keyModel,
  postModel,
  commentModel
};
