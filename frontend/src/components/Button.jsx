const VARIANT_STYLES = {
  primary: {
    background: "#2563eb",
    color: "#fff",
    border: "1px solid transparent",
  },
  secondary: {
    background: "#e5e7eb",
    color: "#111827",
    border: "1px solid #d1d5db",
  },
  outlined: {
    background: "transparent",
    color: "#111827",
    border: "1px solid #d1d5db",
  },
  text: {
    background: "transparent",
    color: "#2563eb",
    border: "1px solid transparent",
  },
  danger: {
    background: "#dc2626",
    color: "#fff",
    border: "1px solid transparent",
  },
};

const SIZE_STYLES = {
  small: { fontSize: 12, padding: "6px 10px" },
  medium: { fontSize: 14, padding: "8px 14px" },
  large: { fontSize: 16, padding: "10px 18px" },
};

const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 6,
  cursor: "pointer",
  transition: "background-color 150ms, box-shadow 150ms, transform 80ms",
  userSelect: "none",
  lineHeight: 1,
  verticalAlign: "middle",
};

const disabledStyle = {
  opacity: 0.6,
  cursor: "not-allowed",
  transform: "none",
  pointerEvents: "none",
};

const IconWrapper = ({ children }) =>
  children ? (
    <span
      style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}
    >
      {children}
    </span>
  ) : null;

const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      onClick,
      disabled = false,
      type = "button",
      fullWidth = false,
      startIcon,
      endIcon,
      style = {},
      className = "",
      ...rest
    },
    ref
  ) => {
    const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
    const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.medium;

    const mergedStyle = {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      width: fullWidth ? "100%" : "auto",
      ...(disabled ? disabledStyle : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled}
        className={className}
        style={mergedStyle}
        {...rest}
      >
        <IconWrapper>{startIcon}</IconWrapper>
        {children}
        <IconWrapper>{endIcon}</IconWrapper>
      </button>
    );
  }
);

export default Button;
