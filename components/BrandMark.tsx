import Image from "next/image";

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
    <Image
      src="/images/logo.png"
      alt=""
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  );
}
