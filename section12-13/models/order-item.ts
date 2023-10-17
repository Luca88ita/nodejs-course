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
import Order from "./order";

export class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare OrderId: ForeignKey<Order["id"]>;
  declare ProductId: ForeignKey<Product["id"]>;
  declare quantity: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare order?: NonAttribute<Order>;
  declare product?: NonAttribute<Product>;

  declare static associations: {
    orders: Association<OrderItem, Order>;
    products: Association<OrderItem, Product>;
  };
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    OrderId: {
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
    tableName: "order-items",
    paranoid: true,
    deletedAt: "destroyTime",
  }
);

export default OrderItem;
