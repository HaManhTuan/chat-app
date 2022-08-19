export function request_year(row){
  if (row.course && row.course.snz_coursetype === 20 && row.snz_application_category === 1) {
    if (row.request_each_year.length) {
      return 'あり';
    }
    return 'なし';
  }
  return 'ー';
}
