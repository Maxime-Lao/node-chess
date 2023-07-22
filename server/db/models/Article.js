const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Article extends Model {}

  Article.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      libelle: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      media: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      euros: {
          type: DataTypes.INTEGER,
          allowNull: true
      },
      id_money: {
          type: DataTypes.INTEGER,
          references: {
              model: 'moneys',
              key: 'id',
          }
      },
    },
    {
      sequelize: connection,
      tableName: "articles",
    }
  );

  Article.associate = (models) => {
    Article.belongsTo(models.Money, { foreignKey: 'id_money', as: 'money' });
    Article.hasMany(models.Buy, { foreignKey: 'id_article', as: 'buys' });
  };

  return Article;
};
