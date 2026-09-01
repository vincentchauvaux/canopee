interface BrandMarkProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export default function BrandMark({
  size = 40,
  className = "",
  priority = false,
}: BrandMarkProps) {
  return (
    // Local PNG : next/image (sharp) dessine un halo clair sur le contour transparent.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt=""
      width={size}
      height={size}
      className={`brand-mark ${className}`}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
