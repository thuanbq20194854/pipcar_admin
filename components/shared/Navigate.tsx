import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface NavigateProps {
  to: string;
}

const Navigate = ({ to }: NavigateProps) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [router, to]);

  return <></>;
};

export default Navigate;
