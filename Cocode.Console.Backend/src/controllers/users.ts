import { Request, Response } from "express";
import { genSaltSync, hashSync } from "bcrypt";
import { UserService } from "../services";

export const createUser = async (_req: Request, _res: Response) => {
  try {
    const { firstName, lastName, email, password, role, dpi } = _req.body;

    const salt = genSaltSync();
    const hashedPassword = await hashSync(password, salt);
    const userService: UserService = _req.app.locals.userService;

    const id = await userService.insertRecord({
      Dpi: dpi,
      Role: role,
      Email: email,
      Password: hashedPassword,
      DisplayName: `${firstName} ${lastName}`,
    });

    return _res.status(200).json({
      id,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(400).json({
      statusCode: 400,
    });
  }
};

export const getUser = async (_req: Request, _res: Response) => {
  try {
    const { userId } = _req.params;

    const userService: UserService = _req.app.locals.userService;
    const userDB = await userService.getRecord(parseInt(userId));

    if (!userDB) {
      return _res.status(404).json({
        statusCode: 404,
      });
    }

    const { Password, ...user } = userDB;

    return _res.status(200).json({
      user,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(400).json({
      statusCode: 400,
    });
  }
};

export const updateUser = async (_req: Request, _res: Response) => {
  const { id, firstName, lastName, password, role } = _req.body;
  try {
    const userService: UserService = _req.app.locals.userService;
    const userDB = await userService.getRecord(id);

    if (!userDB) {
      return _res.status(404).json({
        statusCode: 404,
      });
    }

    if (id == _req.uid) {
      return _res.status(402).json({
        statusCode: 402,
      });
    }

    if (password) {
      const salt = genSaltSync();
      const saltedCurrentPassword = hashSync(password, salt);

      userDB.Password = saltedCurrentPassword;
    }

    userDB.DisplayName = `${firstName} ${lastName}`;
    userDB.Role = role;

    const updated = await userService.updateRecord(id, userDB);

    if (!updated) {
      return _res.status(400).json({
        statusCode: 400,
      });
    }

    return _res.status(200).json({
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const deleteUser = async (_req: Request, _res: Response) => {
  try {
    const { userId } = _req.params;

    if (userId == _req.uid) {
      return _res.status(402).json({
        statusCode: 402,
      });
    }

    const userService: UserService = _req.app.locals.userService;
    const deleted = await userService.deleteRecord(parseInt(userId));

    if (!deleted) {
      return _res.status(400).json({
        statusCode: 400,
      });
    }

    return _res.status(201).json({
      statusCode: 201,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const getUsers = async (_req: Request, _res: Response) => {
  try {
    const { roleId, pageSize = 10, page = 1 } = _req.body;

    const userService: UserService = _req.app.locals.userService;
    const { data, totalItems, currentPage, totalPages } =
      await userService.getRecords(roleId, page, pageSize);

    return _res.status(200).json({
      data,
      count: totalItems,
      page: currentPage,
      pages: totalPages,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(400).json({
      data: [],
      count: 0,
      statusCode: 400,
    });
  }
};

export const getNeighbors = async (_req: Request, _res: Response) => {
  try {
    const userService: UserService = _req.app.locals.userService;

    const data = await userService.listAll(3);

    if (!data || !data.length)
      return _res.status(400).json({
        data: [],
        statusCode: 400,
      });

    return _res.status(200).json({
      data,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      data: [],
      statusCode: 500,
    });
  }
};

export const setInsolventNeighbors = async (_req: Request, _res: Response) => {
  try {
    const userService: UserService = _req.app.locals.userService;

    const wasUpdated = await userService.updateMany({
      Role: 3,
    });

    return _res.status(200).json({
      statusCode: 200,
      wasUpdated,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const updateNeighborStatus = async (_req: Request, _res: Response) => {
  try {
    const { userId, status } = _req.body;

    const userService: UserService = _req.app.locals.userService;

    const wasUpdated = await userService.updateRecord(userId, {
      IsSolvent: status,
    });

    if (!wasUpdated) {
      return _res.status(400).json({
        statusCode: 400,
      });
    }

    return _res.status(200).json({
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const validateUser = async (_req: Request, _res: Response) => {
  try {
    const { dpi, email } = _req.body;

    const userService: UserService = _req.app.locals.userService;

    const existUser = await userService.find({ Email: email, Dpi: dpi });

    if (!existUser) {
      return _res.status(404).json({
        statusCode: 404,
        exists: false,
      });
    }

    return _res.status(200).json({
      statusCode: 200,
      exists: true,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const restorePassword = async (_req: Request, _res: Response) => {
  try {
    const { dpi, email, password } = _req.body;
    const userService: UserService = _req.app.locals.userService;

    const user = await userService.find({ Email: email, Dpi: dpi });
    if (!user) {
      return _res.status(404).json({
        statusCode: 404,
      });
    }

    const salt = genSaltSync();
    const hashedPassword = await hashSync(password, salt);

    const wasRestored = await userService.updateRecord(user.id!, {
      Password: hashedPassword,
    });

    if (!wasRestored) {
      return _res.status(400).json({
        statusCode: 400,
      });
    }

    return _res.status(200).json({
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};
