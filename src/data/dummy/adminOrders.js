// Customer order receipts. Each order can contain items from multiple tenants.
// Customer melihat 1 order (dengan beberapa item dari beberapa tenant).
// Tenant hanya melihat item yang berasal dari tenant mereka sendiri.
// Setiap item berisi daftar produk yang dibeli dari tenant tersebut.

export const dummyAdminOrders = [
  {
    orderId: 'ORD-20260524-0042',
    date: '2026-05-24T14:32:00',
    customerId: 'C-0001',
    tableCode: 'A-03',
    paymentMethod: 'QRIS',
    status: 'completed',
    items: [
      {
        tenantId: 't1',
        tenant: 'Seblak Teh Rina',
        status: 'completed',
        products: [
          { name: 'Seblak Komplit', qty: 1, price: 22_000 },
          { name: 'Seblak Ayam', qty: 1, price: 18_000 },
          { name: 'Es Teh Manis', qty: 1, price: 5_000 },
        ],
      },
      {
        tenantId: 't2',
        tenant: 'Thai Tea Marina',
        status: 'completed',
        products: [
          { name: 'Thai Tea Original', qty: 1, price: 12_000 },
          { name: 'Thai Tea Green', qty: 1, price: 16_000 },
        ],
      },
      {
        tenantId: 't8',
        tenant: 'Es Teh Jumbo',
        status: 'completed',
        products: [
          { name: 'Es Lemon Tea Jumbo', qty: 1, price: 8_000 },
          { name: 'Es Teh Tarik', qty: 1, price: 7_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0041',
    date: '2026-05-24T14:18:00',
    customerId: 'C-0002',
    tableCode: 'C-05',
    paymentMethod: 'GoPay',
    status: 'completed',
    items: [
      {
        tenantId: 't2',
        tenant: 'Thai Tea Marina',
        status: 'completed',
        products: [
          { name: 'Thai Tea Original', qty: 2, price: 12_000 },
          { name: 'Lychee Tea', qty: 1, price: 4_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0040',
    date: '2026-05-24T14:05:00',
    customerId: 'C-0003',
    tableCode: 'D-08',
    paymentMethod: 'OVO',
    status: 'processing',
    items: [
      {
        tenantId: 't5',
        tenant: 'Gorengan Bu Ami',
        status: 'processing',
        products: [
          { name: 'Bakwan Sayur', qty: 3, price: 2_000 },
          { name: 'Tahu Isi', qty: 2, price: 2_000 },
          { name: 'Pisang Goreng', qty: 1, price: 5_000 },
        ],
      },
      {
        tenantId: 't4',
        tenant: 'Kantin Ea Ea',
        status: 'processing',
        products: [
          { name: 'Nasi Goreng Spesial', qty: 1, price: 20_000 },
          { name: 'Es Teh Manis', qty: 1, price: 5_000 },
          { name: 'Kerupuk', qty: 1, price: 7_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0039',
    date: '2026-05-24T13:52:00',
    customerId: 'C-0004',
    tableCode: 'A-12',
    paymentMethod: 'Dana',
    status: 'completed',
    items: [
      {
        tenantId: 't4',
        tenant: 'Kantin Ea Ea',
        status: 'completed',
        products: [
          { name: 'Nasi Goreng Spesial', qty: 1, price: 20_000 },
          { name: 'Ayam Geprek', qty: 1, price: 12_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0038',
    date: '2026-05-24T13:40:00',
    customerId: 'C-0005',
    tableCode: 'C-02',
    paymentMethod: 'QRIS',
    status: 'failed',
    items: [
      {
        tenantId: 't7',
        tenant: 'Mie Ayam Mantap',
        status: 'failed',
        products: [
          { name: 'Mie Ayam Komplit', qty: 1, price: 15_000 },
          { name: 'Mie Ayam Bakso', qty: 1, price: 7_000 },
        ],
      },
      {
        tenantId: 't8',
        tenant: 'Es Teh Jumbo',
        status: 'failed',
        products: [
          { name: 'Es Lemon Tea Jumbo', qty: 1, price: 8_000 },
          { name: 'Es Teh Manis', qty: 1, price: 4_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0037',
    date: '2026-05-24T13:25:00',
    customerId: 'C-0006',
    tableCode: 'B-09',
    paymentMethod: 'QRIS',
    status: 'completed',
    items: [
      {
        tenantId: 't3',
        tenant: 'Siomay Asoy',
        status: 'completed',
        products: [
          { name: 'Siomay Bandung', qty: 1, price: 12_000 },
          { name: 'Siomay Telur', qty: 1, price: 6_000 },
        ],
      },
      {
        tenantId: 't5',
        tenant: 'Gorengan Bu Ami',
        status: 'completed',
        products: [
          { name: 'Bakwan Sayur', qty: 4, price: 2_000 },
          { name: 'Tempe Goreng', qty: 2, price: 2_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0036',
    date: '2026-05-24T13:12:00',
    customerId: 'C-0007',
    tableCode: 'A-15',
    paymentMethod: 'GoPay',
    status: 'refunded',
    items: [
      {
        tenantId: 't8',
        tenant: 'Es Teh Jumbo',
        status: 'refunded',
        products: [
          { name: 'Es Lemon Tea Jumbo', qty: 1, price: 8_000 },
          { name: 'Es Teh Tarik', qty: 1, price: 4_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0035',
    date: '2026-05-24T12:58:00',
    customerId: 'C-0008',
    tableCode: 'B-04',
    paymentMethod: 'QRIS',
    status: 'completed',
    items: [
      {
        tenantId: 't1',
        tenant: 'Seblak Teh Rina',
        status: 'completed',
        products: [
          { name: 'Seblak Komplit', qty: 2, price: 22_000 },
          { name: 'Es Teh Manis', qty: 1, price: 5_000 },
          { name: 'Kerupuk', qty: 2, price: 3_000 },
        ],
      },
      {
        tenantId: 't2',
        tenant: 'Thai Tea Marina',
        status: 'completed',
        products: [
          { name: 'Thai Tea Original', qty: 2, price: 12_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0034',
    date: '2026-05-24T12:44:00',
    customerId: 'C-0009',
    tableCode: 'E-03',
    paymentMethod: 'Cash',
    status: 'completed',
    items: [
      {
        tenantId: 't6',
        tenant: 'Warung Pak Udin',
        status: 'completed',
        products: [
          { name: 'Nasi Goreng Pak Udin', qty: 1, price: 18_000 },
          { name: 'Es Teh Manis', qty: 1, price: 4_000 },
          { name: 'Kerupuk', qty: 1, price: 3_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0033',
    date: '2026-05-24T12:30:00',
    customerId: 'C-0010',
    tableCode: 'E-11',
    paymentMethod: 'Dana',
    status: 'completed',
    items: [
      {
        tenantId: 't2',
        tenant: 'Thai Tea Marina',
        status: 'completed',
        products: [
          { name: 'Thai Tea Original', qty: 1, price: 12_000 },
          { name: 'Thai Tea Green', qty: 1, price: 16_000 },
          { name: 'Lychee Tea', qty: 2, price: 4_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0032',
    date: '2026-05-24T12:15:00',
    customerId: 'C-0011',
    tableCode: 'D-05',
    paymentMethod: 'OVO',
    status: 'disputed',
    items: [
      {
        tenantId: 't5',
        tenant: 'Gorengan Bu Ami',
        status: 'disputed',
        products: [
          { name: 'Bakwan Sayur', qty: 5, price: 2_000 },
          { name: 'Tahu Isi', qty: 2, price: 2_000 },
          { name: 'Combro', qty: 2, price: 2_000 },
        ],
      },
    ],
  },
  {
    orderId: 'ORD-20260524-0031',
    date: '2026-05-24T11:58:00',
    customerId: 'C-0012',
    tableCode: 'A-07',
    paymentMethod: 'QRIS',
    status: 'completed',
    items: [
      {
        tenantId: 't4',
        tenant: 'Kantin Ea Ea',
        status: 'completed',
        products: [
          { name: 'Nasi Goreng Spesial', qty: 1, price: 20_000 },
          { name: 'Ayam Geprek', qty: 1, price: 8_000 },
        ],
      },
      {
        tenantId: 't1',
        tenant: 'Seblak Teh Rina',
        status: 'completed',
        products: [
          { name: 'Seblak Ayam', qty: 1, price: 14_000 },
        ],
      },
    ],
  },
];

// Helper: compute item subtotal (sum of product price * qty)
export const getItemAmount = (item) =>
  item.products.reduce((s, p) => s + p.price * p.qty, 0);

// Helper: derive order-level summary
export const getOrderSummary = (order) => {
  const itemsWithAmount = order.items.map((item) => ({
    ...item,
    amount: getItemAmount(item),
  }));
  const totalAmount = itemsWithAmount.reduce((s, i) => s + i.amount, 0);
  return {
    ...order,
    items: itemsWithAmount,
    totalAmount,
    tenantCount: order.items.length,
  };
};

export const dummyAdminOrdersSummary = dummyAdminOrders.map(getOrderSummary);

// Helper: flatten orders → per-tenant line items
export const flattenOrdersToTransactions = (orders) =>
  orders.flatMap((o) =>
    o.items.map((item, idx) => ({
      id: `${o.orderId}-${String(idx + 1).padStart(2, '0')}`,
      orderId: o.orderId,
      date: o.date,
      customerId: o.customerId,
      paymentMethod: o.paymentMethod,
      tableCode: o.tableCode,
      tenant: item.tenant,
      tenantId: item.tenantId,
      products: item.products,
      amount: getItemAmount(item),
      status: item.status,
    }))
  );
