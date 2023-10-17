import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../util/database";
import Product from "./product";
import Cart from "./cart";
import Order from "./order";

class User extends Model<
  InferAttributes<User, { omit: "products" }>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getProducts: HasManyGetAssociationsMixin<Product>;
  declare addProduct: HasManyAddAssociationMixin<Product, number>;
  declare addProducts: HasManyAddAssociationsMixin<Product, number>;
  declare setProducts: HasManySetAssociationsMixin<Product, number>;
  declare removeProduct: HasManyRemoveAssociationMixin<Product, number>;
  declare removeProducts: HasManyRemoveAssociationsMixin<Product, number>;
  declare hasProduct: HasManyHasAssociationMixin<Product, number>;
  declare hasProducts: HasManyHasAssociationsMixin<Product, number>;
  declare countProducts: HasManyCountAssociationsMixin;
  declare createProduct: HasManyCreateAssociationMixin<Product>;

  declare getCart: HasOneGetAssociationMixin<Cart>;
  declare createCart: HasOneCreateAssociationMixin<Cart>;

  declare getOrders: HasManyGetAssociationsMixin<Order>;
  declare createOrder: HasManyCreateAssociationMixin<Order>;

  declare products?: NonAttribute<Product[]>;

  declare static associations: {
    products: Association<User, Product>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    paranoid: true,
    deletedAt: "destroyTime",
  }
);

export default User;

/*
import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from "sequelize-typescript";
import sequelize from "../util/database";
import Product from "./product";
import { Optional } from "sequelize";

type UserAttributes = {
  id: number;
  username: string;
  email: string;
};

type UserCreationAttributes = Optional<UserAttributes, "id">;

@Table
class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  declare id: number;
  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  declare username: string;
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare email: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  @HasMany(() => Product)
  products: Product[];
}

User.init(
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataType.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataType.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    paranoid: true,
    deletedAt: "destroyTime",
  }
);

export default User;
*/
