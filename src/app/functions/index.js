import AppConfig from 'app/config/AppConfig';

//returns full path of asset
export function getPath(path) {
  let Config = new AppConfig();
  return Config.debug_mode ? Config.media_path + path : path;
}

//generate unique IDs
export function generateUniqueId(length = 16) {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

export function conditionalClassName(className) {
  return className ? ' ' + className : '';
}

export function getMenuRoutes(layer, arr, userData, level = 0) {
  let result = [];
  Object.values(arr).map((item) => {
    if (item.showOnMenu) {
      let obj = Object.assign({}, item);
      if (Object.keys(item.subs).length && level < layer) {
        obj.subs = getMenuRoutes(layer, Object.values(item.subs), userData, level + 1);
      }
      result.push(obj);
    }
  });
  return result;
}

export const convertTimestampToDate = (timestamp, isFormatted = false) => {
  // if value is not a number
  if (isNaN(parseInt(timestamp))) {
    return '';
  }

  timestamp = Number(timestamp);
  const isTimestampWithMilliseconds = Math.abs(Date.now() - new Date(Math.abs(timestamp))) < Math.abs(Date.now() - new Date(Math.abs(timestamp)) * 1000);
  timestamp = isTimestampWithMilliseconds ? new Date(timestamp) : new Date(timestamp * 1000);

  const dateDay = timestamp.getDate();
  const dateMonth = ('0' + (timestamp.getMonth() + 1)).slice(-2);
  const dateYear = String(timestamp.getFullYear()).padStart(4, '0');

  // Add leading zero to dateDay if necessary
  const stylesDateDay = dateDay < 10 ? `0${dateDay}` : dateDay;

  if (isFormatted) {
    return `${stylesDateDay}/${dateMonth}/${dateYear}`;
  }

  return `${dateYear}-${dateMonth}-${stylesDateDay}`;
};

export const convertTimestampToDateTime = (timestamp) => {
  if (!timestamp) {
    return '';
  }

  if (Math.abs(Date.now() - new Date(timestamp)) < Math.abs(Date.now() - new Date(timestamp) * 1000)) {
    timestamp = new Date(timestamp);
  } else {
    timestamp = new Date(timestamp * 1000);
  }

  const formattedDate = new Date(timestamp).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return formattedDate.replace(/\./g, '/');
};

export const convertDateToTimeStamp = (date, timeOfDay = false) => {
  if (!date) {
    return '';
  }

  if (timeOfDay) {
    switch (timeOfDay) {
      case 'start':
        return new Date(date).setHours(0, 0, 0, 0) / 1000;
      case 'end':
        return Math.floor(new Date(date).setHours(23, 59, 59, 999) / 1000);
      default:
        return Date.parse(date) / 1000;
    }
  }

  return Date.parse(date) / 1000;
};

export const formatDate = (unformattedDate) => {
  const formattedDate = new Date(unformattedDate).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formattedDate.replace(/\./g, '/');
};

export const isNumber = (val = false) => {
  if (val || val === 0) {
    return true;
  }

  return false;
};

export function clsx(...classNames) {
  /**
   * Filtering empty classNames and combining them into one string
   * @param {Array} classNames Unlimited number of classNames string
   * @example
   * // returns 'A B D'
   * const A = 'A';
   * const B = 'B';
   * const C = '';
   * const D = 'D';
   * clsx(A, B, C, D);
   */
  return classNames.filter((c) => c).join(' ');
}

export function formatILS(
  value,
  {
    separationSpace = true,
    withoutSymbol = false,
    returnDecimal = false,
    oppositeDir = false,
    ...customSettings
  } = {},
) {
  value = Number(value);

  // Check if the value is numeric (integer or float)
  if (typeof value !== 'number' || isNaN(value)) {
    return NaN;
  }

  // Determine if the value is an integer or has a fractional part
  const hasFractionalPart = value % 1 !== 0;

  // Use Intl.NumberFormat to format the value as ILS, showing decimals only if not zero
  const result = new Intl.NumberFormat('he-IL', {
    style: returnDecimal ? 'decimal' : 'currency',
    currency: 'ILS',
    minimumFractionDigits: hasFractionalPart ? 1 : 0, // Show decimal point only if there is a fractional part
    maximumFractionDigits: hasFractionalPart ? 2 : 0, // Adjust accordingly
    useGrouping: !returnDecimal,
    ...customSettings,
  }).format(value);

  if (returnDecimal) {
    const formattedNumber = value.toFixed(hasFractionalPart ? 2 : 0);
    return hasFractionalPart ? parseFloat(formattedNumber) : parseInt(formattedNumber);
  }

  const resultNumber = result.replace(/[^0-9.,]/g, '').trim();

  if (withoutSymbol) {
    return resultNumber;
  }

  if (oppositeDir) {
    return `₪${separationSpace ? ' ' : ''}${resultNumber}`;
  }

  return `${resultNumber}${separationSpace ? ' ' : ''}₪`;
}
