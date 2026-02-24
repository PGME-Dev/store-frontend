import { useState, useEffect } from 'react';
import { getPackages } from '../api/packages';
import ProductCard from '../components/ProductCard';

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await getPackages();
        setPackages(result.packages || result || []);
      } catch (err) {
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-error">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-text mb-4">Course Packages</h1>
      {packages.length === 0 ? (
        <p className="text-text-secondary text-center py-12">No packages available</p>
      ) : (
        <div className="space-y-3">
          {packages.map((pkg) => {
            const hasTiers = pkg.has_tiers && pkg.tiers?.length > 0;
            const price = hasTiers ? pkg.tiers[0].effective_price || pkg.tiers[0].price : (pkg.sale_price || pkg.price);
            const originalPrice = hasTiers ? pkg.tiers[0].original_price : pkg.original_price;
            const isOnSale = hasTiers ? (pkg.tiers[0].original_price > pkg.tiers[0].effective_price) : pkg.is_on_sale;

            return (
              <ProductCard
                key={pkg._id}
                to={`/packages/${pkg._id}`}
                title={pkg.name}
                subtitle={pkg.type}
                price={price}
                originalPrice={originalPrice}
                isOnSale={isOnSale}
                badge={pkg.type}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
