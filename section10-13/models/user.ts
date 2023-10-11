import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import sequelize from "../util/database";

const seq: Sequelize = sequelize;

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: seq,
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
