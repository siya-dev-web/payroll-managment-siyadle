interface MaterialIconProps {
  icon: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export function MaterialIcon({ icon, className = "", filled = false, size }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        ...(size ? { fontSize: size } : {}),
      }}
    >
      {icon}
    </span>
  );
}
