const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Friend extends Model {}

  Friend.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'waiting'
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      id_user_receiver: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
    },
    {
      sequelize: connection,
      tableName: "friends",
    }
  );

  return Friend;
};
