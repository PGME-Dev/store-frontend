import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getAllPurchases } from '../api/purchases';
import { useAuth } from './AuthContext';

const PurchaseContext = createContext(null);

export function PurchaseProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPurchases();
    } else {
      setPurchaseData(null);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const result = await getAllPurchases();
      setPurchaseData(result);
    } catch (err) {
      console.error('Failed to load purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  // Backend already filters to payment_status: 'completed', so no need to check it here
  const purchasedPackageIds = useMemo(() => {
    const set = new Set();
    (purchaseData?.packages || []).forEach((p) => {
      if (p.is_active) {
        const id = p.package_id;
        if (id) set.add(id.toString());
      }
    });
    return set;
  }, [purchaseData]);

  const purchasedEbookIds = useMemo(() => {
    const set = new Set();
    (purchaseData?.ebook_purchases || []).forEach((p) => {
      if (p.is_active) {
        const id = p.book_id;
        if (id) set.add(id.toString());
      }
    });
    return set;
  }, [purchaseData]);

  const purchasedSessionIds = useMemo(() => {
    const set = new Set();
    (purchaseData?.live_sessions || []).forEach((p) => {
      if (p.is_active) {
        if (p.purchase_id) set.add(p.purchase_id.toString());
      }
    });
    return set;
  }, [purchaseData]);

  const isPackagePurchased = useCallback(
    (id) => purchasedPackageIds.has(id?.toString()),
    [purchasedPackageIds]
  );

  const isEbookPurchased = useCallback(
    (id) => purchasedEbookIds.has(id?.toString()),
    [purchasedEbookIds]
  );

  const isSessionPurchased = useCallback(
    (id) => purchasedSessionIds.has(id?.toString()),
    [purchasedSessionIds]
  );

  const value = {
    purchaseData,
    purchasedPackageIds,
    purchasedEbookIds,
    purchasedSessionIds,
    isPackagePurchased,
    isEbookPurchased,
    isSessionPurchased,
    refreshPurchases: fetchPurchases,
    loading,
  };

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (!context) throw new Error('usePurchase must be used within PurchaseProvider');
  return context;
}
