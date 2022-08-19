import CommonSettings from '../../const/CommonSettings';

export function calcTimeWithTimeZone(date) {
  const offset = CommonSettings.DEFAULT_TIMEZONE;
  if (date){
    const d = new Date(date);
    if (d instanceof Date && !isNaN(d)) {
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      return moment(new Date(utc + (3600000 * offset))).format('yyyy-MM-DD HH:mm:ss');
    }
  }
  return '';
}
