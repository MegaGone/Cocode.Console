import { DataSource } from "typeorm";
import { BaseRepository, PaymentData } from "../database";

export class PaymentService {
  private readonly paymentRepository;

  constructor(datasource: DataSource) {
    this.paymentRepository = new BaseRepository.default(
      datasource,
      PaymentData
    );
  }

  async insertRecord(payment: Partial<PaymentData>): Promise<number> {
    try {
      const { identifiers } = await this.paymentRepository.insert(payment);
      const { id } = identifiers[0];
      if (!id || +id <= 0) return 0;

      return id;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  public async findRecord(
    payment: Partial<PaymentData>
  ): Promise<PaymentData | null> {
    try {
      const record = await this.paymentRepository.findOne(payment);
      return record;
    } catch (error) {
      return null;
    }
  }

  public async updateStatus(
    id: number,
    papayment: Partial<PaymentData>
  ): Promise<boolean> {
    try {
      const { affected } = await this.paymentRepository.update(
        {
          id: id,
        },
        papayment
      );

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      return false;
    }
  }

  async getRecords(page: number, size: number, userId: string) {
    try {
      const skip = (page - 1) * size;
      const take = size;

      const { data, count } = await this.paymentRepository.findWithPagination(
        {
          userId,
        },
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
