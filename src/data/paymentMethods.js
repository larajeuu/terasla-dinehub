export const paymentGroups = [
  {
    id: 'kasir',
    label: 'Kasir & Pay',
    options: [
      {
        id: 'qris',
        label: 'QRIS',
        description: 'Scan dengan e-wallet favoritmu',
        brand: 'qris',
      },
    ],
  },
  {
    id: 'va',
    label: 'Virtual Account',
    options: [
      {
        id: 'bca-va',
        label: 'BCA Virtual Account',
        description: 'Transfer via mobile / internet banking',
        brand: 'bca',
      },
      {
        id: 'bni-va',
        label: 'BNI Virtual Account',
        description: 'Transfer via mobile / internet banking',
        brand: 'bni',
      },
      {
        id: 'mandiri-va',
        label: 'Mandiri Virtual Account',
        description: 'Transfer via mobile / internet banking',
        brand: 'mandiri',
      },
    ],
  },
  {
    id: 'tunai',
    label: 'Tunai',
    options: [
      {
        id: 'cash',
        label: 'Bayar Cash',
        description: 'Bayar langsung di kasir saat pesanan datang',
        brand: 'cash',
      },
    ],
  },
];

export const findPaymentMethodById = (id) => {
  for (const group of paymentGroups) {
    const found = group.options.find((o) => o.id === id);
    if (found) return { ...found, groupLabel: group.label };
  }
  return null;
};
