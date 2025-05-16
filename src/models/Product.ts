import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Category from './Category';

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  rating: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public categoryId!: number;
  public rating!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      index: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
      index: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0.0,
        max: 5.0,
      },
      index: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    indexes: [
      {
        name: 'product_name_idx',
        fields: ['name'],
      },
      {
        name: 'product_price_idx',
        fields: ['price'],
      },
      {
        name: 'product_rating_idx',
        fields: ['rating'],
      },
      {
        name: 'product_category_idx',
        fields: ['categoryId'],
      },
    ],
  }
);

Product.belongsTo(Category, { foreignKey: 'categoryId' });

export default Product;