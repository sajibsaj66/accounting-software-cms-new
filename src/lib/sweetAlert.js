import swal from "sweetalert";

const baseOptions = {
  className: "premium-swal",
  buttons: {
    confirm: {
      text: "OK",
      value: true,
      visible: true,
      className: "premium-swal-button",
      closeModal: true,
    },
  },
};

export function showSuccessAlert(title, text) {
  return swal({
    ...baseOptions,
    title,
    text,
    icon: "success",
  });
}

export function showErrorAlert(title, text) {
  return swal({
    ...baseOptions,
    title,
    text,
    icon: "error",
  });
}

export function showWarningAlert(title, text) {
  return swal({
    ...baseOptions,
    title,
    text,
    icon: "warning",
  });
}
