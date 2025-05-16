import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';

interface CategoryAttributes {
  id: number;
  name: string;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
  }
);

Category.hasMany(Product, { foreignKey: 'categoryId' });

export default Category;