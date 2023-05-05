import {DateTime} from "luxon";


const defaultEuroCurrencyOptions = {
  style: 'currency',
  currency: 'EUR',
};
const shortEuroFormat = new Intl.NumberFormat(
  'fr',
  {
    ...defaultEuroCurrencyOptions,
    maximumFractionDigits: 0
  }
);
const longEuroFormat = new Intl.NumberFormat(
  'fr',
  defaultEuroCurrencyOptions
);

const shortDateFormat = 'dd/MM/yyyy';
const longDateFormat  = 'dd MMM yyyy';


export const toLongEuroFormat = (amount) => longEuroFormat.format(amount);

export const toShortEuroFormat = (amount) => shortEuroFormat.format(amount);


export const toShortDateFormat = (dateText) => DateTime
  .fromISO(dateText)
  .toFormat(shortDateFormat)
;

export const toLongDateFormat = (dateText) => DateTime
  .fromISO(dateText, { locale: 'fr' })
  .toFormat(longDateFormat)
;
