import { AuthService } from "../services";
import { Request, Response } from "express";
import { UserData } from "../database/entities/User";
import { generateJWT, getMenuByRole } from "../helpers";

export const login = async (_req: Request, _res: Response) => {
  const { email, dpi } = _req.body;

  try {
    const authService: AuthService = _req.app.locals.authService;
    const user: UserData | null = await authService.getRecord(email, dpi);

    if (!user) {
      return _res.status(404).json({
        statusCode: 404,
      });
    }

    const token = await generateJWT(JSON.stringify(user.id));

    const userDB = {
      id: user.id,
      email: user.Email,
      name: user.DisplayName,
      role: user.Role,
      createdAt: user.createdAt,
    };

    return _res.status(200).json({
      "x-token": token,
      user: userDB,
      menu: getMenuByRole(user.Role),
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const getSession = async (_req: Request, _res: Response) => {
  try {
    const { uid } = _req;

    const authService: AuthService = _req.app.locals.authService;
    const user = await authService.getSession(parseInt(uid));

    if (!user) {
      return _res.status(404).json({
        statusCode: 404,
      });
    }

    const userDB = {
      id: user.id,
      email: user.Email,
      name: user.DisplayName,
      role: user.Role,
      createdAt: user.createdAt,
    };

    return _res.status(200).json({
      user: userDB,
      "x-token": _req.params["x-token"],
      menu: getMenuByRole(user.Role),
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};
