import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

// PROBLEMA #3: se importa lodash y moment enteros para dos llamadas.
export function headline(value: string): string {
  return _.capitalize(value);
}

export function todayLabel(): string {
  return moment().format('LL');
}

export function neverUsedHash(input: string): string {
  return _.uniqueId(input);
}
