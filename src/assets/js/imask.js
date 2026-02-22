import IMask from 'imask';

const $inputs = document.querySelectorAll('.js-imask');

$inputs.forEach(($input) => {
  const maskType = $input.dataset.mask;

  let options = null;

  switch (maskType) {
    case 'digit':
      options = {
        mask: /^[0-9]$/,
      };
      break;

    case 'phone':
      options = {
        mask: '+{7} (000) 000-00-00',
      };
      break;

    default:
      return;
  }

  IMask($input, options);
});
