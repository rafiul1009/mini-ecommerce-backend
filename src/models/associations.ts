import User from './User';
import Product from './Product';
import Category from './Category';
import Order from './Order';
import OrderItem from './OrderItem';

const defineAssociations = () => {
  // User associations
  User.hasMany(Product, { foreignKey: 'userId' });
  User.hasMany(Category, { foreignKey: 'userId' });
  User.hasMany(Order, { foreignKey: 'userId' });

  // Category associations
  Category.hasMany(Product, { foreignKey: 'categoryId' });
  Category.belongsTo(User, { foreignKey: 'userId' });

  // Product associations
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Product.belongsTo(User, { foreignKey: 'userId' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'userId' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });
};

export default defineAssociations;