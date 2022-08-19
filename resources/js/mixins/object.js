import _ from 'lodash';

export function isEquivalent(a, b) {
  var aProps = Object.keys(a);
  var bProps = Object.keys(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    // eslint-disable-next-line no-empty
    if (arrayEquals(a[propName], b[propName])) {
      continue;
    }
    if (_.isEqual(a[propName], b[propName])) {
      continue;
    }
    const eq = _.isEqualWith(a[propName], b[propName], (x, y) => {
      if ((_.isNull(x) || x === '') && (_.isNull(y) || y === '')) {
        return true;
      }
    });
    if (eq) {
      continue;
    }
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    JSON.stringify(a === JSON.stringify(b));
}
