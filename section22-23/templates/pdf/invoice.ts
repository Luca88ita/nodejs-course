import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import mainPath from "../../util/path";
import { IOrder } from "../../models/order";

namespace PDFModel {
  export const getPDFInvoice = (res: any, order: IOrder) => {
    const invoiceName = `invoice-${order._id}.pdf`;
    const invoicePath = path.join(
      mainPath as string,
      "data",
      "invoices",
      invoiceName
    );
    const pdfInvoice = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
    pdfInvoice.pipe(fs.createWriteStream(invoicePath));
    pdfInvoice.pipe(res);

    pdfInvoice
      .fontSize(26)
      .text(`Invoice for the order #${order._id}`, { underline: true });
    pdfInvoice.fontSize(14).text("---------------------------");
    let totalPrice = 0;
    order.products.forEach((item) => {
      totalPrice += item.product.price * item.quantity!;
      pdfInvoice.text(
        `${item.product.title} - $${item.product.price} - ${item.quantity} pc.`
      );
    });
    pdfInvoice.text("---------------------------");
    pdfInvoice.fontSize(20).text(`Total amount: $${totalPrice}`);

    pdfInvoice.end();

    //for long dimension files the below code may overflow the memory usage!
    /* fs.readFile(invoicePath, (err, data) => {
      if (err) return next(err);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${invoiceName}"`
      );
      res.send(data);
    }); */
    // the below code instead streams the invoice data
    /* const file = fs.createReadStream(invoicePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${invoiceName}"`
    );
    file.pipe(res); */
  };
}

export default PDFModel;
