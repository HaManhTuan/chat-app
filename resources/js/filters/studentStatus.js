import _ from 'lodash';
import StudentStatus from '../const/StudentStatus';

export function studentStatusLabel(status) {
  const stt = _.filter(StudentStatus.OPTION_SNZ_STUDENTSTATUS, function(
    item
  ) {
    return item.value === status;
  });
  if (stt.length) {
    return stt[0].label;
  }
  return '';
}
