const {Model, DataTypes} = require("sequelize");

module.exports = function (connection) {
    class Buy extends Model {
    }

    Buy.init({
        id: {
            type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
        }, date: {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
        },
        id_article: {
            type: DataTypes.INTEGER, allowNull: false
        },
        id_user: {
            type: DataTypes.INTEGER, allowNull: false
        },
    }, {
        sequelize: connection, tableName: "buys",
    });

  Buy.associate = (models) => {
    Buy.belongsTo(models.Article, { foreignKey: 'id_article', as: 'article' });
    Buy.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  };

    return Buy;
};