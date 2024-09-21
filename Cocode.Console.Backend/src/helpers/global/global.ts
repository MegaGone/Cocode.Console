export const getCurrentDate = (): string => {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const anioActual = fechaActual.getFullYear();
  return `${meses[mesActual]} ${anioActual}`;
};

export const sanitizeDate = (dateString: Date): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };

  return new Intl.DateTimeFormat("es-ES", options).format(date);
};
