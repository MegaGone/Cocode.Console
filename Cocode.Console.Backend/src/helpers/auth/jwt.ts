import { sign } from "jsonwebtoken";
import { SECRETKEY } from "../../config";
import { MenuItem } from "../../typings/global";

export const generateJWT = (uid: string): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    sign(
      payload,
      SECRETKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          return reject("400");
        }

        return resolve(token);
      }
    );
  });
};

export const getMenuByRole = (role: number): MenuItem[] => {
  const menu: MenuItem[] = [];

  switch (role) {
    case 1:
      menu.push({
        id: "apps.administrador",
        title: "Administración",
        type: "collapsable",
        icon: "heroicons_outline:clipboard-check",
        children: [
          {
            id: "apps.administrador.users",
            title: "Usuarios",
            type: "basic",
            link: "/administrador/usuarios",
          },
          {
            id: "apps.administrador.reports",
            title: "Reportes",
            type: "basic",
            link: "/administrador/reportes",
          },
          {
            id: "apps.administrador.payments",
            title: "Historial de pagos",
            type: "basic",
            link: "/administrador/historial-pagos",
          },
          {
            id: "apps.administrador.services",
            title: "Servicios",
            type: "basic",
            link: "/administrador/servicios",
          },
          {
            id: "apps.administrador.minutes",
            title: "Actas",
            type: "basic",
            link: "/administrador/actas",
          },
          {
            id: "apps.administrador.wages",
            title: "Jornales",
            type: "basic",
            link: "/administrador/jornales",
          },
        ],
      });
      break;

    case 3:
      menu.push({
        id: "apps.resident",
        title: "Vecino",
        type: "collapsable",
        icon: "heroicons_outline:home",
        children: [
          {
            id: "apps.residente.payments",
            title: "Pagos",
            type: "basic",
            link: "/residente/pagos",
          },
          {
            id: "apps.residente.minutes",
            title: "Actas",
            type: "basic",
            link: "/residente/actas",
          },
        ],
      });
      break;
  }

  return menu;
};
