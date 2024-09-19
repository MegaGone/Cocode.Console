import { once } from "events";
import { resolve } from "path";
import PDFDocument from "pdfkit-table";
import { createWriteStream } from "fs";
import {
  NIT,
  COMPANY_NAME,
  FIRST_ADDRESS,
  SECOND_ADDRESS,
  MULTER_DIRECTORY,
  PHONE_NUMBER,
  QR_IMAGE_NAME,
} from "../config";

export class PDFGenerator {
  public static async create(
    dpi: string,
    email: string,
    month: string,
    amount: number,
    userName: string,
    serviceName: string,
    paymentType: string,
    filename: string
  ) {
    try {
      const doc = new PDFDocument({ compress: false });
      const path = `${MULTER_DIRECTORY}/${filename}`;

      const writeStream = createWriteStream(path);
      doc.pipe(writeStream);

      // QR
      const qr = resolve(MULTER_DIRECTORY, QR_IMAGE_NAME);
      doc.image(qr, (doc.page.width - 100) / 2, 50, {
        align: "center",
        width: 100,
        height: 100,
      });

      doc.moveDown(6);

      // Encabezado
      doc
        .moveDown(2)
        .fontSize(14)
        .text(COMPANY_NAME, { align: "center" })
        .moveDown(0.5)
        .fontSize(12)
        .text(FIRST_ADDRESS, { align: "center" })
        .text(SECOND_ADDRESS, { align: "center" })
        .moveDown(0.5)
        .text(`Nit: ${NIT}`, { align: "center" })
        .text(`Tel: (502) ${PHONE_NUMBER}`, { align: "center" });

      // Detalles de recibo
      doc.moveDown(1).fontSize(12).text(`Fecha: ${month}`, { align: "center" });
      // .text(`No. Recibo: 1453835`, { align: "center" });

      // Datos personales
      doc
        .moveDown(1)
        .text(`DPI: ${dpi}`, { align: "center" })
        .text(`Nombre: ${userName}`, { align: "center" })
        .text(`Correo: ${email}`, {
          align: "center",
        });

      // Detalle pago
      const pageWidth = doc.page.width;
      const tableWidth1 = 90 + 90 + 100;

      const table = {
        headers: ["Tipo pago", "Servicio", "Monto"],
        rows: [[paymentType, serviceName, `Q${amount}`]],
      };

      doc.moveDown(1);
      doc.text("Cifras expresadas en Quetzales", { align: "center" });
      doc.moveDown(0.5);
      doc.x = (pageWidth - tableWidth1) / 2;
      doc.table(table, {
        prepareHeader: () => doc.fontSize(12),
        prepareRow: () => doc.fontSize(10),
        columnsSize: [90, 90, 100],
      });

      // Conceptos de pago
      const tableWidth2 = 190 + 90;
      const conceptosTable = {
        headers: ["Conceptos de pago", "Importe"],
        rows: [
          ["Principal", `Q${amount}.00`],
          ["Recargo", "Q0.00"],
          ["Intereses", "Q0.00"],
        ],
      };

      doc.moveDown(1);
      doc.x = (pageWidth - tableWidth2) / 2;
      doc.table(conceptosTable, {
        prepareHeader: () => doc.fontSize(12),
        prepareRow: () => doc.fontSize(10),
        columnsSize: [190, 90],
      });

      // Finaliza el documento
      doc.end();

      await once(writeStream, "finish");
      doc.on("finish", () => {
        console.log("CREATED");
      });
    } catch (error) {
      console.log("ERROR CREATING PDF", error);
    }
  }
}
