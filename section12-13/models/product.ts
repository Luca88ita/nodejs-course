import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../util/database";
import User from "./user";
import CartItem from "./cart-item";
import OrderItem from "./order-item";

// Class Approach
class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare UserId: ForeignKey<User["id"]>;
  declare title: string;
  declare imageUrl: string;
  declare description: string;
  declare price: number;

  declare user?: NonAttribute<User>;
  declare CartItem?: NonAttribute<CartItem>;
  declare OrderItem?: NonAttribute<OrderItem>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    cartItem: Association<Product, CartItem>;
    orderItem: Association<Product, OrderItem>;
  };
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "products",
    paranoid: true,
    deletedAt: "destroyTime",
  }
);

export default Product;
