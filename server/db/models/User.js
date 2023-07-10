module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  const bcrypt = require("bcryptjs");

  class User extends Model {
    isPasswordValid(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      login: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(320),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isNotNull: function (value) {
            if (value === null) {
              throw new Error("Email cannot be null");
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          //min: 8,
          //is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        },
      },
      elo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500
      },
      media: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: "default.png"
      },
      isBanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      id_role: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        }
      },
    },
    {
      sequelize: connection,
      tableName: "users",
    }
  );

  function updatePassword(user) {
    return bcrypt.genSalt(10).then((salt) =>
      bcrypt.hash(user.password, salt).then((hash) => {
        user.password = hash;
      })
    );
  }

  User.addHook("beforeCreate", (user) => {
    return updatePassword(user);
  });

  User.addHook("beforeUpdate", async (user, options) => {
    if (options.fields.includes("password")) {
      return updatePassword(user);
    }
  });

  return User;
};
