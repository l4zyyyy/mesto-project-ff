import { likeCard, unlikeCard, deleteCard as apiDeleteCard } from './api.js';

export function handleLikeClick(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function createCard(cardData, onDelete, onLike, onImageClick, userId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = `Изображение места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      apiDeleteCard(cardData._id)
        .then(() => {
          onDelete(cardElement);
        })
        .catch(err => console.error('Ошибка удаления карточки:', err));
    });
  }

  if (cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const apiCall = isLiked ? unlikeCard : likeCard;

    apiCall(cardData._id)
      .then(updatedCard => {
        likeButton.classList.toggle('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch(err => console.error('Ошибка лайка:', err));
  });

  cardImage.addEventListener('click', () => onImageClick(cardData));

  return cardElement;
}
