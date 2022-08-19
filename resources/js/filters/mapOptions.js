import _ from 'lodash';

export function mapOptions(status, options) {
  const stt = _.filter(options, function(
    item
  ) {
    return item.value === status;
  });
  if (stt.length) {
    return stt[0].label;
  }
  return '';
}
