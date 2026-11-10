import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline";
export type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseStyle =
  "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all disabled:cursor-not-allowed active:scale-[0.98] active:shadow-inner disabled:active:scale-100 disabled:active:shadow-none";

const sizeStyle: Record<ButtonSize, string> = {
  md: "rounded px-4 py-2.5 text-large",
  lg: "rounded-xl px-8 py-5 text-body-1 min-h-16",
};

const variantStyle: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary-600 text-white shadow-lg",
    "hover:bg-primary-400",
    "active:bg-primary-900",
    "disabled:bg-gray-200 disabled:text-gray-600 disabled:shadow-none",
  ].join(" "),
  outline: [
    "border border-gray-700 bg-white text-gray-900",
    "hover:border-primary-400 hover:bg-secondary-100 hover:text-secondary-700",
    "active:border-gray-900",
    "disabled:border-gray-300 disabled:text-gray-500",
  ].join(" "),
};

export function buttonStyle(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return `${baseStyle} ${sizeStyle[size]} ${variantStyle[variant]} ${className}`;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonStyle(variant, size, className)} {...props} />;
}
