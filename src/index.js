import './pages/index.css'
import { initialCards } from './scripts/cards.js'
import { createCard, deleteCard, handleLikeClick } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';

import logo from './images/logo.svg'
import avatar from './images/avatar.jpg'

document.addEventListener('DOMContentLoaded', () => {
  const logoImg = document.getElementById('logo');
  logoImg.src = logo;
  logoImg.alt = 'Логотип проекта';

  const avatarDiv = document.getElementById('avatar');
  avatarDiv.style.backgroundImage = `url(${avatar})`;
});

const cardTemplate = document.querySelector('#card-template').content;
const placeList = document.querySelector('.places__list');

initialCards.forEach((cardData) => {
    const card = createCard(cardData, deleteCard, handleLikeClick, handleImageClick);
    placeList.appendChild(card);
});

const profileEditButton = document.querySelector('.profile__edit-button');

profileEditButton.addEventListener('click', () => {
  const currentName = document.querySelector('.profile__title').textContent;
  const currentJob = document.querySelector('.profile__description').textContent;

  nameInput.value = currentName;
  jobInput.value = currentJob;

  openPopup(editPopup);
});

const profileAddButton = document.querySelector('.profile__add-button');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');
const allPopups = document.querySelectorAll('.popup');

profileAddButton.addEventListener('click', () => openPopup(addPopup));

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
});

// Находим форму в DOM
const profileForm = document.querySelector('.popup__form')// Воспользуйтесь методом querySelector()
// Находим поля формы в DOM
const nameInput = document.querySelector('.popup__input_type_name')// Воспользуйтесь инструментом .querySelector()
const jobInput = document.querySelector('.popup__input_type_description') // Воспользуйтесь инструментом .querySelector()

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
function handleProfileFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
                                                // Так мы можем определить свою логику отправки.
                                                // О том, как это делать, расскажем позже.
    const name = nameInput.value;
    const job = jobInput.value;
    // Получите значение полей jobInput и nameInput из свойства value
    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description')
    // Выберите элементы, куда должны быть вставлены значения полей
    profileTitle.textContent = name;
    profileDescription.textContent = job;
    // Вставьте новые значения с помощью textContent
    closePopup(editPopup);
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
profileForm.addEventListener('submit', handleProfileFormSubmit);

const formAddCard = document.forms['new-place'];

const placeNameInput = document.querySelector('.popup__input_type_card-name');
const linkInput = document.querySelector('.popup__input_type_url');

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const placeName = placeNameInput.value;
  const link = linkInput.value;
  const newCard = createCard({ name: placeName, link: link }, deleteCard, handleLikeClick, handleImageClick);
  placeList.prepend(newCard);
  closePopup(addPopup);
  evt.target.reset();  
};

formAddCard.addEventListener('submit', handleAddCardSubmit);

const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = `Изображение места: ${cardData.name}`;
  popupCaption.textContent = cardData.name;
  openPopup(popupTypeImage);
};

allPopups.forEach(popup => {
  popup.classList.add('popup_is-animated');
})
