export const specialCharacterValidator = (val = '') => {
  if (val) {
    //FIXME: change to ASCII Range
    if (!/^[|@₹#$%^&+*!=() ?0-9]*$/.test(val)) {
      return true;
    } else return false;
  } else return true;
};


export const emailValidator = (val = '') => {
  if (val) {
    //FIXME: change to ASCII Range
    if (/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$|^$/.test(val)) {
      return true;
    } else return false;
  } else return true;
};

export const mobileValidator = (val = '') => {
  if (val) {
    //FIXME: change to ASCII Range
    if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(val)) {
      return true;
    } else return false;
  } else return true;
};

export const passwordValidator = (val = '') => {
  if (val) {
    //FIXME: change to ASCII Range
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(val)) {
      return true;
    } else return false;
  } else return true;
};