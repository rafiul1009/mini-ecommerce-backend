import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  categoryId: number;
  userId: number;
}

// Mark `id` and `rating` as optional for creation
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'rating'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public rating!: number;
  public categoryId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Override toJSON to return only dataValues
  public toJSON(): ProductAttributes {
    return this.get({ plain: true });
  }
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
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('price');
    
        if (typeof value === 'number') {
          return value;
        }
    
        return value ? parseFloat(value as string) : null;
      }
    },    
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0.0,
        max: 5.0,
      },
      get() {
        const value = this.getDataValue('rating');
    
        if (typeof value === 'number') {
          return value;
        }
    
        return value ? parseFloat(value as string) : 0.0;
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
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
    tableName: 'Products',
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['price'],
      },
      {
        fields: ['rating'],
      }
    ]
  }
);

export default Product;