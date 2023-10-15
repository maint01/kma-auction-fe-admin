import {toast} from "react-toastify";

export const showSuccess = (content, delay) => {
  toast.success(content, {autoClose: delay || 5000})
}

export const showWarning = (content, delay) => {
  toast.success(content, {autoClose: delay || 5000})
}

export const showError = (content, delay) => {
  toast.error(content, {autoClose: delay || 5000})
}
