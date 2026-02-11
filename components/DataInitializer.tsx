'use client';

import { useEffect, useRef } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useOrderStore } from '@/store/useOrderStore';
import { usePromoStore } from '@/store/usePromoStore';
import { useHeroStore } from '@/store/useHeroStore';

export default function DataInitializer() {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchPromo = usePromoStore((state) => state.fetchPromo);
  const fetchHero = useHeroStore((state) => state.fetchHero);
  
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetchProducts();
    fetchCategories();
    fetchOrders();
    fetchPromo();
    fetchHero();
  }, [fetchProducts, fetchCategories, fetchOrders, fetchPromo, fetchHero]);

  return null;
}
