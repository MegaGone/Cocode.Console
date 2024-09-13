import { DataSource, IsNull } from "typeorm";
import { BaseRepository, MinuteData } from "../database";

export class MinuteService {
  private readonly _minuteRepository: BaseRepository.default<MinuteData>;

  constructor(private readonly _datasource: DataSource) {
    this._minuteRepository = new BaseRepository.default(
      this._datasource,
      MinuteData
    );
  }

  public async create(minute: Partial<MinuteData>): Promise<number> {
    try {
      const { identifiers } = await this._minuteRepository.insert(minute);
      const { Id } = identifiers[0];

      return Id;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const { affected } = await this._minuteRepository.update(
        {
          Id: id,
        },
        {
          DeletedAt: new Date(),
        }
      );

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      return false;
    }
  }

  public async findPaginated(page: number, size: number, role: number = 3) {
    try {
      const skip = (page - 1) * size;
      const take = size;

      const { data, count } = await this._minuteRepository.findWithPagination(
        {
          DeletedAt: role === 3 ? IsNull() : undefined,
        },
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
