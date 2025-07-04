// Функция показа ошибки
export const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  options
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(options.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(options.errorClass);
};

// Функция скрытия ошибки
export const hideInputError = (formElement, inputElement, options) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(options.inputErrorClass);
  errorElement.classList.remove(options.errorClass);
  errorElement.textContent = "";
};

// Функция проверки валидности
export const isValid = (formElement, inputElement, options) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      options
    );
  } else {
    hideInputError(formElement, inputElement, options);
  }
};

// Проверка на невалидные поля//
export const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Переключение состояния кнопки
export const toggleButtonState = (inputList, buttonElement, options) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(options.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(options.inactiveButtonClass);
  }
};

// Установка обработчиков событий валидации
export const setEventListeners = (formElement, options) => {
  const inputList = Array.from(
    formElement.querySelectorAll(options.inputSelector)
  );
  const buttonElement = formElement.querySelector(options.submitButtonSelector);

  // Инициализация состояния кнопки
  toggleButtonState(inputList, buttonElement, options);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValid(formElement, inputElement, options);
      toggleButtonState(inputList, buttonElement, options);
    });
  });
};

// Включение валидации для всех форм
export const enableValidation = (options) => {
  const formList = Array.from(document.querySelectorAll(options.formSelector));

  formList.forEach((formElement) => {
    setEventListeners(formElement, options);
  });
};

export const clearValidation = function (modalForm, options) {
  const formInputList = Array.from(
    modalForm.querySelectorAll(options.inputSelector)
  );
  formInputList.forEach((formInput) => {
    hideInputError(modalForm, formInput, options);
  });
  const buttonElement = modalForm.querySelector(
    options.submitButtonSelector
  );
  toggleButtonState(formInputList, buttonElement, options);
};
