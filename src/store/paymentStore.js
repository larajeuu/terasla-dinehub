import { create } from 'zustand';

const usePaymentStore = create((set) => ({
  selectedMethod: null,
  setSelectedMethod: (method) => set({ selectedMethod: method }),
  clearSelectedMethod: () => set({ selectedMethod: null }),
}));

export default usePaymentStore;
