import request from '@/utils/request';

export function fetchNumberAssignment(searchForm) {
  return request({
    url: '/number-assignment/search',
    method: 'get',
    params: searchForm,
  });
}
export function exportCSV(){
  return request({
    url: 'number-assignment/export-csv',
    method: 'get',
    responseType: 'blob',
  });
}
