import { DataSource, FindOptionsWhere } from "typeorm";

import { UserData, BaseRepository } from "../database";

export class UserService {
  private readonly userRepository;

  constructor(datasource: DataSource) {
    this.userRepository = new BaseRepository.default(datasource, UserData);
  }

  async insertRecord(user: Partial<UserData>): Promise<number> {
    try {
      const { identifiers } = await this.userRepository.insert(user);
      const { id } = identifiers[0];
      if (!id || +id <= 0) return 0;

      return id;
    } catch (error) {
      return 0;
    }
  }

  async updateRecord(_id: number, user: Partial<UserData>): Promise<boolean> {
    try {
      const { id, ...userDB } = user;

      await this.userRepository.update({ id: _id }, userDB);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRecord(id: number) {
    try {
      const user: UserData | null = await this.userRepository.findOne({ id });
      if (!user) return null;

      return user;
    } catch (error) {
      return null;
    }
  }

  async deleteRecord(id: number): Promise<boolean> {
    try {
      const deleted = await this.userRepository.delete({ id: id });
      if (!deleted || deleted.affected == 0) return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  async getRecords(roleId: number, page: number, size: number) {
    try {
      const skip = (page - 1) * size;
      const take = size;
      let where = {};

      if (roleId > 0) {
        where = { Role: roleId };
      }

      const { data, count } = await this.userRepository.findWithPagination(
        where,
        {
          createdAt: "DESC",
        },
        take,
        skip,
        [
          "Role",
          "id",
          "DisplayName",
          "Email",
          "IsSolvent",
          "Dpi",
          "Telefono",
          "Direccion",
        ]
      );

      const pagination = {
        data: data,
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / size),
      };

      return pagination;
    } catch (error) {
      throw error;
    }
  }

  public async listAll(role: number) {
    try {
      const data = await this.userRepository.findAll(
        {
          Role: role,
        },
        {
          createdAt: "DESC",
        },
        ["id", "Email", "DisplayName", "Dpi", "Direccion", "Telefono"]
      );

      if (!data.length) return null;

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async updateMany(options: Partial<UserData>) {
    try {
      const { affected } = await this.userRepository.updateMany(
        { IsSolvent: false },
        "Role = :Role",
        options
      );

      return affected ? true : false;
    } catch (error) {
      throw error;
    }
  }

  public async find(
    where: FindOptionsWhere<UserData>
  ): Promise<Partial<UserData> | null> {
    try {
      const user = await this.userRepository.findOne(where);
      return user ? user : null;
    } catch (error) {
      return null;
    }
  }
}
