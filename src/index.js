import './pages/index.css'
import { createCard, deleteCard, handleLikeClick } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  updateAvatar
} from './components/api.js';

import logo from './images/logo.svg'
import avatar from './images/avatar.jpg'

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

document.addEventListener('DOMContentLoaded', () => {
  const logoImg = document.getElementById('logo');
  logoImg.src = logo;
  logoImg.alt = 'Логотип проекта';

  const avatarDiv = document.getElementById('avatar');
  avatarDiv.style.backgroundImage = `url(${avatar})`;
});

const cardTemplate = document.querySelector('#card-template').content;
const placeList = document.querySelector('.places__list');
let userId;

const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = `Изображение места: ${cardData.name}`;
  popupCaption.textContent = cardData.name;
  openPopup(popupTypeImage);
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;

    document.querySelector('.profile__title').textContent = userData.name;
    document.querySelector('.profile__description').textContent = userData.about;
    document.getElementById('avatar').style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      const card = createCard(cardData, deleteCard, handleLikeClick, handleImageClick, userId);
      placeList.appendChild(card);
    });
  })
  .catch((err) => {
    console.error('Ошибка загрузки данных:', err);
  });

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');
const allPopups = document.querySelectorAll('.popup');

const profileForm = document.querySelector('.popup__form');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');

profileEditButton.addEventListener('click', () => {
  const currentName = document.querySelector('.profile__title').textContent;
  const currentJob = document.querySelector('.profile__description').textContent;

  nameInput.value = currentName;
  jobInput.value = currentJob;

  clearValidation(profileForm, validationConfig);
  openPopup(editPopup);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const saveButton = profileForm.querySelector('.popup__button');
  const originalText = saveButton.textContent;
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;

  updateUserInfo(nameInput.value, jobInput.value)
    .then(data => {
      document.querySelector('.profile__title').textContent = data.name;
      document.querySelector('.profile__description').textContent = data.about;
      closePopup(editPopup);
    })
    .catch(err => console.error('Ошибка при обновлении профиля:', err))
    .finally(() => {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    });
}

profileForm.addEventListener('submit', handleProfileFormSubmit);

const formAddCard = document.forms['new-place'];
const placeNameInput = document.querySelector('.popup__input_type_card-name');
const linkInput = document.querySelector('.popup__input_type_url');

profileAddButton.addEventListener('click', () => {
  formAddCard.reset();
  clearValidation(formAddCard, validationConfig);
  openPopup(addPopup);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const saveButton = formAddCard.querySelector('.popup__button');
  const originalText = saveButton.textContent;
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;

  const placeName = placeNameInput.value;
  const link = linkInput.value;

  addNewCard(placeName, link)
    .then(cardData => {
      const newCard = createCard(cardData, deleteCard, handleLikeClick, handleImageClick, userId);
      placeList.prepend(newCard);
      closePopup(addPopup);
      evt.target.reset();
    })
    .catch(err => console.error('Ошибка при добавлении карточки:', err))
    .finally(() => {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    });
}

formAddCard.addEventListener('submit', handleAddCardSubmit);

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closePopup(popup);
  });
});

allPopups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });

  popup.classList.add('popup_is-animated');
});

enableValidation(validationConfig);

const avatarDiv = document.getElementById('avatar');
const editAvatarIcon = document.querySelector('.profile__edit-avatar');
const popupAvatar = document.querySelector('.popup_type_edit-avatar');
const formAvatar = popupAvatar.querySelector('form');
const inputAvatarLink = formAvatar.querySelector('.popup__input_type_avatar-url');
const avatarSaveButton = formAvatar.querySelector('.popup__button');
const avatarError = formAvatar.querySelector('.popup__input-error');

// Функция валидации URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Проверка валидности поля аватара
function validateAvatarInput() {
  const value = inputAvatarLink.value.trim();
  if (!value) {
    showAvatarError('Поле обязательно для заполнения');
    return false;
  }
  if (!isValidUrl(value)) {
    showAvatarError('Введите корректный URL');
    return false;
  }
  hideAvatarError();
  return true;
}

function showAvatarError(message) {
  avatarError.textContent = message;
  avatarError.classList.add(validationConfig.errorClass);
  inputAvatarLink.classList.add(validationConfig.inputErrorClass);
  avatarSaveButton.disabled = true;
}

function hideAvatarError() {
  avatarError.textContent = '';
  avatarError.classList.remove(validationConfig.errorClass);
  inputAvatarLink.classList.remove(validationConfig.inputErrorClass);
  avatarSaveButton.disabled = false;
}

// Обработчик изменения поля аватара
inputAvatarLink.addEventListener('input', () => {
  validateAvatarInput();
});

// Открыть попап редактирования аватара
editAvatarIcon.addEventListener('click', () => {
  formAvatar.reset();
  hideAvatarError();
  avatarSaveButton.disabled = true;
  openPopup(popupAvatar);
  inputAvatarLink.focus();
});

// Обработчик сабмита формы аватара
formAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!validateAvatarInput()) {
    return;
  }

  const originalText = avatarSaveButton.textContent;
  avatarSaveButton.textContent = 'Сохранение...';
  avatarSaveButton.disabled = true;

  const newAvatarUrl = inputAvatarLink.value.trim();

  updateAvatar(newAvatarUrl)
    .then(data => {
      avatarDiv.style.backgroundImage = `url(${data.avatar})`;
      closePopup(popupAvatar);
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
      showAvatarError('Ошибка обновления аватара. Проверьте ссылку.');
    })
    .finally(() => {
      avatarSaveButton.textContent = originalText;
      avatarSaveButton.disabled = false;
    });
});
