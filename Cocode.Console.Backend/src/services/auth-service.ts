import { DataSource } from "typeorm";
import { UserData, BaseRepository } from "../database";

export class AuthService {
  private readonly authRepository;

  constructor(datasource: DataSource) {
    this.authRepository = new BaseRepository.default(datasource, UserData);
  }

  async getRecord(dpi: string): Promise<UserData | null> {
    try {
      const user: UserData | null = await this.authRepository.findOne(
        { Dpi: dpi },
        false
      );

      if (!user) return null;

      return user;
    } catch (error) {
      return null;
    }
  }

  async getSession(id: number): Promise<UserData | null> {
    try {
      const user = await this.authRepository.findOne({ id }, false, [
        "Role",
        "id",
        "DisplayName",
        "Email",
        "Dpi",
        "Telefono",
        "Direccion",
      ]);
      if (!user) return null;

      return user;
    } catch (error) {
      return null;
    }
  }
}
