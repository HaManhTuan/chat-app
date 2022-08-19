/* All validations should be defined here */

import Promise from 'lodash/_Promise';
import { FILE } from '../const/ImportStatus';

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * Validate a valid URL
 * @param {String} textval
 * @return {Boolean}
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * Validate a full-lowercase string
 * @return {Boolean}
 * @param {String} str
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * Validate a full-uppercase string
 * @return {Boolean}
 * @param {String} str
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * Check if a string contains only alphabet
 * @param {String} str
 * @param {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * Validate an email address
 * @param {String} email
 * @return {Boolean}
 */
export function validEmail(email) {
  return MAIL_FORMAT.test(email);
}

export function validNumberHalfSize(code) {
  const re = /(^[0-9]+$)+/;
  return re.test(code);
}

export const MAIL_FORMAT =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NUMBER_HALF_SIZE = /(^[0-9]+$)+/;
export const NUMBER_HALF_SIZE_WITH_COMA = /(^[0-9,]+$)+/;
export const MONEY_HALF_SIZE =
  /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/;
export const HALF_SIZE = /(^[a-zA-Z0-9]+$)+/;
export const KANA_FULL_WIDTH = /(^[ァ-ンーヴ・ ]+$)+/;
// eslint-disable-next-line no-control-regex
export const FULL_WIDTH_ONLY = /^[^ -~｡-ﾟ\x00-\x1f\t]+$/;
export const ZERO_FIRST = /^0.*/;
export const TELEPHONE_LENGTH = /^.{10,11}$/;
export const KANA_FULL_WIDTH_OR_HALFWIDTH =
  /(^[ぁ-んァ-ンa-zA-Z0-9-\u4E00-\u9FAF々ヶヵーヴ・﨑晴靖逸飯館塚羽 ]+$)/;
export const DOT_NOT_FIRST = /^(?!.*\.@).*$/;
export const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+$/;

export const CHECK_VALID_POSTAL_CODE = (
  rule,
  value,
  callback,
  source,
  options
) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.zipaddress.net?zipcode=' + value)
      .then((res) => res.json())
      .then((out) => {
        switch (out.code) {
          case 404:
          case 400:
            reject(callback(new Error('該当する住所が見つかりません')));
            break;
        }
        resolve(callback());
      })
      .catch((err) => reject(callback(new Error(err))));
  });
};

export function isExcel(file) {
  return file && FILE.FORMATS[file.type];
}

export function isOverMaxFileSize(file) {
  return file && file.size > FILE.MAX_SIZE;
}
