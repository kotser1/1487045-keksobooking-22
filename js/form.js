import { sendData } from './api.js';
import { setDefaultAdress, resetMainPinMarker, mapFilters, onMapFiltersChange} from './map.js';
import { numDecline } from './util.js';
import { resetPhotos } from './upload-image.js';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const DEFAULT_MAX_PRICE = 1000000;

const DEFAULT_MIN_PRICE = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalow: 0,
};

const Keys = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
};

const numberOfGuests = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0'],
};

const offerForm = document.querySelector('.ad-form');
const checkinTime = offerForm.querySelector('#timein');
const checkoutTime = offerForm.querySelector('#timeout');
const offerType = offerForm.querySelector('#type');
const offerPrice = offerForm.querySelector('#price');
const capacitySelect = offerForm.querySelector('#capacity');
const capacityOptions = capacitySelect.querySelectorAll('option');
const selectRooms = offerForm.querySelector('#room_number');
const offerTitleInput = offerForm.querySelector('#title');
const resetButton = offerForm.querySelector('.ad-form__reset');
const main = document.querySelector('main');
const successMessageTemplate = document.querySelector('#success').content;
const successMessage = successMessageTemplate.querySelector('.success');
const errorMessageTemplate = document.querySelector('#error').content;
const errorMessage = errorMessageTemplate.querySelector('.error');


checkinTime.addEventListener('change', () => {
  checkoutTime.value = checkinTime.value;
});

checkoutTime.addEventListener('change', () => {
  checkinTime.value = checkoutTime.value;
});

const onOfferTypeChange = () => {
  offerPrice.placeholder = DEFAULT_MIN_PRICE[offerType.value];
  offerPrice.min = DEFAULT_MIN_PRICE[offerType.value];
};

offerType.addEventListener('change', onOfferTypeChange);

offerPrice.addEventListener('input', () => {
  if (offerPrice.value > DEFAULT_MAX_PRICE) {
    offerPrice.setCustomValidity('Цена не должна превышать ' + DEFAULT_MAX_PRICE + ' руб.');
  } else if (offerPrice.value < DEFAULT_MIN_PRICE[offerType.value]) {
    offerPrice.setCustomValidity('Цена должна быть не менее ' + DEFAULT_MIN_PRICE[offerType.value] + ' руб.');
  } else {
    offerPrice.setCustomValidity('');
  }

  offerPrice.reportValidity();
});


offerTitleInput.addEventListener('input', () => {
  const valueLength = offerTitleInput.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    offerTitleInput.setCustomValidity('Ещё ' + (MIN_TITLE_LENGTH - valueLength) + ' ' + numDecline((MIN_TITLE_LENGTH - valueLength), 'символ', 'символа', 'символов'));
  } else if (valueLength > MAX_TITLE_LENGTH) {
    offerTitleInput.setCustomValidity('Заголовок не должен превышать' + MAX_TITLE_LENGTH + ' ' + numDecline(MAX_TITLE_LENGTH, 'символ', 'символа', 'символов'));
  } else {
    offerTitleInput.setCustomValidity('');
  }

  offerTitleInput.reportValidity();
});


const validateRooms = () => {
  const roomValue = selectRooms.value;
  capacityOptions.forEach((option) => {
    let isDisabled = (numberOfGuests[roomValue].indexOf(option.value) === -1);
    option.selected = numberOfGuests[roomValue][0] === option.value;
    option.disabled = isDisabled;
    option.hidden = isDisabled;
  });
};

const onSelectRoomsChange = () => {
  validateRooms();
};

validateRooms();

selectRooms.addEventListener('change', onSelectRoomsChange);


const onSuccessMessageClick = () => {
  closeSuccessMessage();
}

const onSuccessMessageKeydown = (evt) => {
  if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
    closeSuccessMessage();
  }
}

const closeSuccessMessage = () => {
  successMessage.remove();
  document.removeEventListener('keydown', onSuccessMessageKeydown);
  document.removeEventListener('click', onSuccessMessageClick);
};

const showSuccessMessage = () => {
  main.appendChild(successMessage);
  document.addEventListener('keydown', onSuccessMessageKeydown);
  document.addEventListener('click', onSuccessMessageClick);
  offerForm.reset();
  mapFilters.reset();
  onMapFiltersChange();
  setDefaultAdress();
  resetMainPinMarker();
  onOfferTypeChange();
  resetPhotos();
};

const onErrorMessageClick = () => {
  closeErrorMessage();
}

const onErrorMessageKeydown = (evt) => {
  if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
    closeErrorMessage();
  }
}

const closeErrorMessage = () => {
  errorMessage.remove();
  document.removeEventListener('keydown', onErrorMessageKeydown);
  document.removeEventListener('click', onErrorMessageClick);
};

const showErrorMessage = () => {
  main.appendChild(errorMessage);
  document.addEventListener('keydown', onErrorMessageKeydown);
  document.addEventListener('click', onErrorMessageClick);
};

const setUserFormSubmit = () => {
  offerForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    sendData(showSuccessMessage, showErrorMessage, new FormData(evt.target));
  });
};

setUserFormSubmit();


resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  offerForm.reset();
  mapFilters.reset();
  onMapFiltersChange();
  setDefaultAdress();
  resetMainPinMarker();
  onOfferTypeChange();
  resetPhotos();
})
