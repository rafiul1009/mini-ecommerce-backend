import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  categoryId: number;
  categoryName: string;
  quantity: number;
  price: number;
}

// Mark `id` as optional for creation
interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> { }

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public productName!: string;
  public productDescription!: string;
  public productPrice!: number;
  public categoryId!: number;
  public categoryName!: string;
  public quantity!: number;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Override toJSON to return only dataValues
  public toJSON(): OrderItemAttributes {
    return this.get({ plain: true });
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
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
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('productPrice');
    
        if (typeof value === 'number') {
          return value;
        }
    
        return value ? parseFloat(value as string) : null;
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items'
  }
);

export default OrderItem;