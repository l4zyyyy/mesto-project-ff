// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки
const cardTemplate = document.querySelector('#card-template').content;
function deleteCard(cardElement) {
    const placeList = document.querySelector('.places__list');
    placeList.removeChild(cardElement);
}
function createCard(cardData, onDelete) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    deleteButton.addEventListener('click', () => {
        onDelete(cardElement);
    });
    return cardElement;
}

const placeList = document.querySelector('.places__list');

initialCards.forEach((cardData) => {
    const card = createCard(cardData, deleteCard)
    placeList.appendChild(card);
});

// @todo: Вывести карточки на страницу
