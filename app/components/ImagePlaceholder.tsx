type Props = {
  label: string;
  className?: string;
};

export default function ImagePlaceholder({ label, className = '' }: Props) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-brand-accent/40 bg-black/30 p-4 text-center text-xs tracking-widest text-brand-accent/80 backdrop-blur-sm ${className}`}
      role="img"
      aria-label={`${label} placeholder`}
    >
      {label.toUpperCase()}
    </div>
  );
}
