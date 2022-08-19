import Contact from '@/const/Contact';
export const filterUpdateStatus = status => {
  const stt = _.filter(Contact.OPTION_UPDATE_STATUS, function(item) {
    return item.value === status;
  });
  if (stt.length) {
    return stt[0].label;
  }
  return '';
};
