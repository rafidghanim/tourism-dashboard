import type { ButtonHTMLAttributes } from "react";

export function IconButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`icon-button ${className}`} {...props} />
  );
}
