export default function Validate(value, rules) {
  const Validations = {
    no_validation: {
      valid: (val) => true,
      msg: '',
    },
    not_empty: {
      valid: (val) => val !== '' && val !== undefined,
      msg: 'שדה חובה',
    },
    address: {
      valid: (val) => val !== '' && val !== undefined,
      msg: 'יש לבחור כתובת למשלוח',
    },
    package: {
      valid: (val) => val !== '' && val !== undefined,
      msg: 'יש לבחור מסלול',
    },
    email: {
      valid: (val) =>
        /^([\w!#$%&'*+-/=?^`{|}~]+\.)*[\w!#$%&'*+-/=?^`{|}~]+@((((([a-zA-Z0-9]{1}[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]{1})|[a-zA-Z])\.)+[a-zA-Z]{2,8})|(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?)$/.test(
          val,
        ),
      msg: 'כתובת דוא"ל שגויה',
    },
    cell: {
      valid: (val) => /^(?:(0(?:50|51|52|53|54|55|57|58|72|73|74|76|77|78)[-]?[0-9]{7}))$/.test(val),
      msg: 'מספר סלולרי שגוי',
    },
    phone: {
      valid: (val) => /^(?:(0(?:2|3|4|8|9|7|50|51|52|53|54|55|56|57|58|59|72|73|74|76|77|78)[-]?[0-9]{7}))$/.test(val),
      msg: 'מספר טלפון שגוי',
    },
    id: {
      valid: (id) => {
        id = String(id).trim();
        if (id.length !== 9 || isNaN(id) || id === '000000000') return false;
        return (
          Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
          }) %
          10 ===
          0
        );
      },
      msg: 'תעודת זהות לא תקינה',
    },
    full_name: {
      valid: (val) => /^([\u0590-\u05FF.,'"-]{2,})+\s+([\u0590-\u05FF.,'"-\s]{2,})+$/.test(val),
      msg: 'יש למלא שם פרטי ושם משפחה',
    },
    first_name: {
      valid: (val) => /^(?=.*[\u0590-\u05FF “.'"׳-]{2})[\u0590-\u05FF\s “.'"׳-]{2,}$/.test(val),
      msg: 'יש למלא שם פרטי',
    },
    last_name: {
      valid: (val) => /^(?=.*[\u0590-\u05FF “.'"׳-]{2})[\u0590-\u05FF\s “.'"׳-]{2,}$/.test(val),
      msg: 'יש למלא שם משפחה',
    },
    last_digits: {
      valid: (val) => /^[0-9]*$/.test(val) && val.length === 4,
      msg: 'אנא הזינו 4 ספרות אחרונות בכרטיס האשראי',
    },
    checkbox: {
      valid: (val) => val,
      msg: 'שדה חובה',
    },
    required_select: {
      valid: (val) => {
        if (val === undefined || val === '' || val === 0) return false;
        return val != -1;
      },
      msg: 'שדה חובה',
    },
    required_radio: {
      valid: (val) => {
        if (val === undefined || val === '') return false;
        return true;
      },
      msg: 'שדה חובה',
    },
    required_date: {
      valid: (val) => {
        return !!val;
      },
      msg: 'שדה חובה',
    },
    digits_only: {
      valid: (val) => /^\d+$/.test(val),
      msg: 'ספרות בלבד',
    },
    greater_than_zero: {
      valid: (val) => parseInt(val) > 0,
      msg: 'שדה חובה',
    },
    general_website_url: {
      valid: (val) =>
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
          val,
        ),
      msg: 'כתובת לא תקנית',
    },
    hebrew_characters: {
      valid: (val) => /^([\u05D0-\u05EA ״׳'-/"]{2,})+$/.test(val),
      msg: 'שדה לא תקין',
    },
    address_street: {
      valid: (val) => /^([\d\u05D0-\u05EA ״׳'-/"]{2,})+$/.test(val),
      msg: 'שדה לא תקין',
    },
    is_number: {
      valid: (val) => /^\d+$/.test(val),
      msg: 'שדה מכיל תווים לא מורשים',
    },
    minimum_three_characters: {
      valid: (val = '') => /^.{3,}$/m.test(val?.trim()),
      msg: 'חובה מינימום 3 תווים',
    },
    webhook: {
      valid: (val) => Validate(val, ['general_website_url'])?.valid ?? false,
      msg: 'כתובת webhook לא תקינה',
    },
    is_not_empty_array: {
      valid: (val) => Array.isArray(val) && val?.length > 0,
      msg: 'לא נבחרה שום אפשרות',
    },
    max_ten_digits: {
      valid: (val) => /^\d{1,10}$/.test(val),
      msg: 'עד 10 ספרות בלבד',
    },
  };

  let valid = true;
  let msg = '';

  for (let rule of rules) {
    if (typeof rule === 'function') {
      valid = rule();
      msg = 'שדה חובה';
    } else {
      if (!Validations[rule].valid(value)) {
        valid = false;
        msg = Validations[rule].msg;
        break;
      }
    }
  }

  return { valid: valid, msg: msg };
}
