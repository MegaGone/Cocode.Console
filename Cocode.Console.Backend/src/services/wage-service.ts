import { DataSource } from "typeorm";
import { BaseRepository, WageData } from "../database";

export class WageService {
  private readonly _wageRepository: BaseRepository.default<WageData>;

  constructor(private readonly _datasource: DataSource) {
    this._wageRepository = new BaseRepository.default(
      this._datasource,
      WageData
    );
  }

  public async create(minute: Partial<WageData>): Promise<number> {
    try {
      const { identifiers } = await this._wageRepository.insert(minute);
      const { Id } = identifiers[0];

      return Id;
    } catch (error) {
      return 0;
    }
  }

  public async update(id: number, record: Partial<WageData>): Promise<boolean> {
    try {
      const { affected } = await this._wageRepository.update(
        {
          Id: id,
        },
        record
      );

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      return false;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const { affected } = await this._wageRepository.update(
        {
          Id: id,
        },
        {
          Status: 3,
          DeletedAt: new Date(),
        }
      );

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      return false;
    }
  }

  public async findPaginated(page: number, size: number) {
    try {
      const skip = (page - 1) * size;
      const take = size;

      const { data, count } = await this._wageRepository.findWithPagination(
        {},
        {
          CreatedAt: "DESC",
        },
        take,
        skip
      );

      return {
        data: data,
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / size),
      };
    } catch (error) {
      throw error;
    }
  }
}
