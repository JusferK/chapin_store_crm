export const iMaskNumber = {
  mask: Number,
  thousandsSeparator: ',',
};

export const iMaskPrice = {
  mask: 'Q num',
  lazy: true,
  blocks: {
    num: {
      mask: Number,
      scale: 2,
      signed: false,
      thousandsSeparator: ',',
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: '.',
      mapToRadix: [','],
      min: 0,
      max: 99999999.99,
    },
  },
};

export const iMaskEmail = {
  mask: /^\S*@?\S*$/,
  lazy: false,
  placeholderChar: '',
};
