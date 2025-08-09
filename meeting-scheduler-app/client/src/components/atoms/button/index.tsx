import React from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';
type ButtonOutlineVariant = Exclude<ButtonVariant, 'link'>;
type ButtonSize = 'sm' | 'lg';

type CommonProps = {
  variant?: ButtonVariant;
  outline?: boolean;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    href?: undefined;
  };

type ButtonAsLinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button(props: ButtonProps): JSX.Element {
  const { variant = 'primary', outline, size, className, children } = props;
  const href = (props as ButtonAsLinkProps).href;

  const base = outline
    ? `btn btn-outline-${variant as ButtonOutlineVariant}`
    : `btn btn-${variant}`;
  const classes = [base, size ? `btn-${size}` : undefined, className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    const { href: linkHref, ...rest } = props as ButtonAsLinkProps;
    return (
      <a href={linkHref} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const rest = props as ButtonAsButtonProps;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
