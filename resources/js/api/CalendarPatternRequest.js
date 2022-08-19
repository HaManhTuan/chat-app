import Resource from '@/api/resource';
import request from '../utils/request';
import store from '../store';

class CalendarPatternRequest extends Resource {
  constructor() {
    super('calendar-pattern');
  }

  calendarPatternOption(params) {
    return request({
      url: '/' + this.uri + '/calendar-pattern-options',
      method: 'get',
      params: {
        ...params,
      },
    });
  }
  searchName(params) {
    return request({
      url: '/' + this.uri + '/search-name',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { CalendarPatternRequest as default };
