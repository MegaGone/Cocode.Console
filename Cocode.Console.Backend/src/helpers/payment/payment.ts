import { v4 as uuidv4 } from "uuid";
import { PaymentService } from "../../services";

export const validatePayment = async (
  service: PaymentService,
  userId: string,
  monthId: string,
  serviceId: number
): Promise<boolean> => {
  try {
    const { data } = await service.getRecords(1, 12, userId);
    const existPayment = await data.findIndex(
      (p) => p.month == monthId && p.serviceId == serviceId
    );

    return existPayment != -1 ? false : true;
  } catch (error) {
    return false;
  }
};

export const validateSolvent = (payments: number): boolean => {
  const currentDate = new Date();
  const totalMonths = currentDate.getMonth() + 1;

  return payments >= totalMonths;
};

export const generateFileID = () => {
  const uniqueID = uuidv4();
  return `${uniqueID}.pdf`;
};
