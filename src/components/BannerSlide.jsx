import { Link } from 'react-router-dom';
import { bannerTarget } from '../lib/bannerTarget';

/**
 * One promotional banner image, linked to wherever it's configured to go.
 *
 * Used by both carousels on Home. The signed-in one used to hardcode
 * `<Link to="/sessions">` for every banner regardless of its target, and the
 * guest one followed the app's `linkUrl`, which this site has no routes for —
 * so a banner pointing at a package, ebook or session went nowhere useful.
 */
export default function BannerSlide({ banner }) {
  const target = bannerTarget(banner);

  const img = (
    <img
      src={banner.imageUrl || banner.image_url}
      alt={banner.title || 'Banner'}
      className="w-full h-full object-cover rounded-3xl"
    />
  );

  if (target.kind === 'internal') {
    return (
      <Link to={target.to} className="block w-full h-full">
        {img}
      </Link>
    );
  }

  if (target.kind === 'external') {
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {img}
      </a>
    );
  }

  return img;
}
