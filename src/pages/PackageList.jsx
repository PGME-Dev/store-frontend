import { useState, useEffect } from 'react';
import { getPackages } from '../api/packages';
import { useSubject } from '../context/SubjectContext';
import { usePurchase } from '../context/PurchaseContext';
import SubjectSelector from '../components/SubjectSelector';
import ProductCard from '../components/ProductCard';

export default function PackageList() {
  const { subjectId } = useSubject();
  const { isPackagePurchased } = usePurchase();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const result = await getPackages(subjectId);
        setPackages(result.packages || result || []);
      } catch {
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId]);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 sm:mb-8 lg:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/6 rounded-xl flex items-center justify-center text-primary shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text">Course Packages</h1>
            <p className="text-text-secondary text-xs sm:text-sm">Browse our collection of medical course packages</p>
          </div>
        </div>
        <SubjectSelector />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-error text-sm">{error}</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-secondary">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <p className="text-text-secondary text-sm">No packages available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {packages.map((pkg) => {
            const hasTiers = pkg.has_tiers && pkg.tiers?.length > 0;
            const price = hasTiers ? pkg.tiers[0].effective_price || pkg.tiers[0].price : (pkg.sale_price || pkg.price);
            const originalPrice = hasTiers ? pkg.tiers[0].original_price : pkg.original_price;
            const isOnSale = hasTiers ? (pkg.tiers[0].original_price > pkg.tiers[0].effective_price) : pkg.is_on_sale;

            return (
              <ProductCard
                key={pkg.package_id}
                to={`/packages/${pkg.package_id}`}
                title={pkg.name}
                subtitle={pkg.type || pkg.package_type}
                price={price}
                originalPrice={originalPrice}
                isOnSale={isOnSale}
                badge={pkg.type || pkg.package_type}
                purchased={pkg.is_purchased || isPackagePurchased(pkg.package_id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
