import create from 'zustand';

interface Store {
  products: any[];
  addProduct: (product: any) => void;
}

const useStore = create<Store>((set) => ({
  products: [],
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
}));

export default useStore;