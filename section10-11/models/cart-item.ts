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
import Product from "./product";
import User from "./user";
import Cart from "./cart";

export class CartItem extends Model<
  InferAttributes<CartItem>,
  InferCreationAttributes<CartItem>
> {
  declare id: CreationOptional<number>;
  declare CartId: ForeignKey<Cart["id"]>;
  declare ProductId: ForeignKey<Product["id"]>;
  declare quantity: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare cart?: NonAttribute<Cart>;
  declare product?: NonAttribute<Product>;

  declare static associations: {
    carts: Association<CartItem, Cart>;
    products: Association<CartItem, Product>;
  };
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    CartId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    ProductId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "cart-items",
  }
);

export default CartItem;
