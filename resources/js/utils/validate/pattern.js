export const MAIL_FORMAT = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NUMBER_HALF_SIZE = /(^[0-9]+$)+/;
export const HALF_SIZE = /(^[a-zA-Z0-9]+$)+/;
export const KANA_FULL_WIDTH = /(^[ァ-ンーヴ・ ]+$)+/;
// eslint-disable-next-line no-control-regex
export const FULL_WIDTH_ONLY = /^[^ -~｡-ﾟ\x00-\x1f\t]+$/;
export const ZERO_FIRST = /^0.*/;
export const TELEPHONE_LENGTH = /^.{10,11}$/;
export const KANA_FULL_WIDTH_OR_HALFWIDTH = /(^[ぁ-んァ-ンa-zA-Z0-9-\u4E00-\u9FAF々ヶヵーヴ・﨑晴靖逸飯館塚羽 ]+$)/;
export const DOT_NOT_FIRST = /^(?!.*\.@).*$/;
export const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+$/;
