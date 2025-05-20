"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class Product extends sequelize_1.Model {
    // Override toJSON to return only dataValues
    toJSON() {
        return this.get({ plain: true });
    }
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const value = this.getDataValue('price');
            if (typeof value === 'number') {
                return value;
            }
            return value ? parseFloat(value) : null;
        }
    },
    rating: {
        type: sequelize_1.DataTypes.DECIMAL(2, 1),
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
            return value ? parseFloat(value) : 0.0;
        },
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id',
        },
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
}, {
    sequelize: database_config_1.default,
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
});
exports.default = Product;
