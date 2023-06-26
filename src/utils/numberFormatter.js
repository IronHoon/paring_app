import 'intl';
import 'intl/locale-data/jsonp/en';

const numberFormatter = (number, showAll) => {
  let value;
  if (number) {
    if (!showAll) {
      value = new Intl.NumberFormat('en', { notation: 'compact' }).format(number);
    } else {
      value = new Intl.NumberFormat('en').format(number);
    }
  }
  return value || 0;
};

export default numberFormatter;
