import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
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
import OrderItem from "./order-item";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare UserId: ForeignKey<User["id"]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getProducts: BelongsToManyGetAssociationsMixin<Product>;
  declare addProduct: BelongsToManyAddAssociationMixin<
    Product,
    { through: OrderItem }
  >;
  declare addProducts: BelongsToManyAddAssociationsMixin<
    Product,
    { through: OrderItem }
  >;

  declare getUser: BelongsToGetAssociationMixin<User>;

  declare User?: NonAttribute<User>;
  declare Products?: NonAttribute<Product[]>;

  declare static associations: {
    user: Association<Order, User>;
    Products: Association<Order, Product>;
  };
}

Order.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "orders",
    paranoid: true,
    deletedAt: "destroyTime",
  }
);

export default Order;
