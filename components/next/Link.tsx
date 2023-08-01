import { default as NextLink, LinkProps } from 'next/link';
import { forwardRef } from 'react';

export type TLinkProps = LinkProps & {
  className?: string;
  children?: React.ReactNode;
};

const Link = forwardRef<HTMLAnchorElement, TLinkProps>(
  ({ className, children, onClick, href = '/', ...props }, forwardedRef) => {
    return (
      <NextLink {...props} legacyBehavior passHref href={href}>
        <a
          className={className}
          onClick={onClick}
          ref={forwardedRef}
          style={{ textDecoration: 'none' }}
        >
          {children}
        </a>
      </NextLink>
    );
  },
);
Link.displayName = 'Link';

export default Link;
