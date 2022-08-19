import { type } from '@/const/InquiryType';
import moment from 'moment';
import _ from 'lodash';
import toiawaseStatus from '../const/ToiawaseStatus';

export function approachWebText(row) {
  if (!row) {
    return '';
  }
  if (row.apply_register) {
    return '体験申込';
  }
  if ([type.IN_WEB_HP, type.IN_WEB_JUKU, type.IN_WEB_INQUIRY].includes(row.snz_inquirytype) && !row.snz_interviewdate) {
    return 'WEB未アポ';
  }
  if ([type.TELEPHONE, type.VOICE_WARP, type.IN_SCHOOL].includes(row.snz_inquirytype) && !row.snz_interviewdate) {
    return '直来・直電未アポ';
  }
  const today = moment();
  const interviewaDate = moment(row.snz_interviewdate, 'YYYY/MM/DD');
  if (row.snz_interviewdate && today.isBefore(interviewaDate)) {
    return '面談アポ済';
  }
  if (row.snz_interviewdate && today.isAfter(interviewaDate) && !row.snz_internalcode) {
    return 'どう？';
  }
  if (row.snz_internalcode) {
    return '体験申込';
  }
}

export function approachend(status) {
  const stt = _.filter(toiawaseStatus.OPTION_SNZ_APPROACHEND, function(
    item
  ) {
    return item.value === status;
  });
  if (stt.length) {
    return stt[0].label;
  }
  return 'ー';
}
