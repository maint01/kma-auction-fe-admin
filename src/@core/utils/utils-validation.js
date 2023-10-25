export const validateText = (value) => {
  return (
    value !== undefined && value !== null && value.toString().trim() !== ""
  );
};

export const validateTextLength = (value, length) => {
  return value?.trim().length > length;
};

export const validateEmail = (value) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
    value
  );
};

export const validateVietnamPhoneNumber = (value) => {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value);
};


export const validateOnlyNumber = (value) => {
  return /^\d+$/g.test(value);
};

export function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

/*
 * validate option la object
 * isRequired: bat buoc
 * isMail: format dang email
 * isPhone: format dang so dien thoai
 * isNumber: phai la so
 * minLength: do dai toi thieu
 * maxLength: do dai toi da
 * maxLength: do dai toi da
 * */
export const validations = (target, setCallback, label, option, isValidate) => {
  isValidate = isValidate !== false;
  if (
    isValidate &&
    option.isRequired &&
    (!target.value || !validateText(target.value))
  ) {
    setCallback({
      ...target,
      error: true,
      help: `Vui lòng nhập ${label}`,
    });

    return false;
  }

  if (
    isValidate &&
    option.isMail &&
    target.value &&
    !validateEmail(target.value)
  ) {
    setCallback({
      ...target,
      error: true,
      help: `Vui lòng nhập đúng định dạng email`,
    });

    return false;
  }

  if (
    isValidate &&
    option.isPhone &&
    target.value &&
    !validateVietnamPhoneNumber(target.value)
  ) {
    setCallback({
      ...target,
      error: true,
      help: `Vui lòng nhập đúng định dạng ${label}`,
    });

    return false;
  }

  if (
    isValidate &&
    option.maxLength &&
    validateTextLength(target.value, option.maxLength)
  ) {
    setCallback({
      ...target,
      error: true,
      help: `Vui lòng nhập ${label} không quá ${option.maxLength} ký tự`,
    });

    return false;
  }

  if (
    isValidate &&
    option.isNumber &&
    target.value &&
    !validateOnlyNumber(target.value)
  ) {
    setCallback({
      ...target,
      error: true,
      help: `Vui lòng nhập đúng định dạng ${label}`,
    });

    return false;
  }

  setCallback({ value: target.value, error: false, help: "" });

  return true;
};
