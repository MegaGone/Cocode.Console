import "dotenv/config";

const COMPANY_NAME = process.env.COMPANY_NAME || "COCODE CUILCO GUATEMALA";
const FIRST_ADDRESS =
  process.env.FIRST_ADDRESS || "Ciudad Guatemala: Vía 6, 3-42 Zona 4";
const SECOND_ADDRESS =
  process.env.SECOND_ADDRESS || "Huehuetenango: 7a. Calle 13-70 Zona 4";
const NIT = process.env.NIT || "11223344-5";
const PHONE_NUMBER = process.env.PHONE_NUMBER || "23283333";
const QR_IMAGE_NAME = process.env.QR_IMAGE_NAME || "qr.png";

export {
  NIT,
  COMPANY_NAME,
  PHONE_NUMBER,
  FIRST_ADDRESS,
  QR_IMAGE_NAME,
  SECOND_ADDRESS,
};
