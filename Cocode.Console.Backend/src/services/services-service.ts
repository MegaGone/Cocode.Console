import { DataSource } from "typeorm";
import { BaseRepository, ServiceData } from "../database";

export class ServicesService {
  private readonly _repo;

  constructor(datasource: DataSource) {
    this._repo = new BaseRepository.default(datasource, ServiceData);
  }

  public async insert(payment: Partial<ServiceData>): Promise<number> {
    try {
      const { identifiers } = await this._repo.insert(payment);
      const { id } = identifiers[0];
      if (!id || +id <= 0) return 0;

      return id;
    } catch (error) {
      return 0;
    }
  }

  public async disable(_id: number): Promise<boolean> {
    try {
      await this._repo.update(
        { id: _id },
        {
          IsEnabled: false,
        }
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  public async update(
    _id: number,
    service: Partial<ServiceData>
  ): Promise<boolean> {
    try {
      await this._repo.update(
        { id: _id },
        {
          Name: service?.Name,
          Price: service?.Price,
          IsEnabled: service?.IsEnabled,
        }
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  public async find(name: string): Promise<Partial<ServiceData> | undefined> {
    try {
      const record = await this._repo.findOne({ Name: name });

      return record ? record : undefined;
    } catch (error) {
      return undefined;
    }
  }

  public async findById(id: number): Promise<ServiceData | null> {
    try {
      const record = await this._repo.findOne({ id, IsEnabled: true });
      return record;
    } catch (error) {
      return null;
    }
  }

  public async findPaginated(page: number, size: number, role: number) {
    try {
      const skip = (page - 1) * size;
      const take = size;

      let where = {};
      if (role === 3) {
        where = {
          IsEnabled: true,
        };
      }

      const { data, count } = await this._repo.findWithPagination(
        where,
        {
          id: "DESC",
        },
        take,
        skip
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
}
