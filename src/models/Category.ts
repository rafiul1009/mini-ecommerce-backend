import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';

interface CategoryAttributes {
  id: number;
  name: string;
  userId: number;
}

// Mark `id` as optional for creation
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Override toJSON to return only dataValues
  public toJSON(): CategoryAttributes {
    return this.get({ plain: true });
  }
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Category',
  }
);

export default Category;