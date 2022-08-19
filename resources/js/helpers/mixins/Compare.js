import _ from 'lodash';

export const isArrayEqual = function(x, y) {
  return _(x)
    .xorWith(y, _.isEqual)
    .isEmpty();
};

export const diffArrayObject = (x, y) => {
  return _.differenceWith(x, y, _.isEqual);
};
