import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { useRouter } from 'next/router';
import Link from 'src/components/next/Link';

const breadcrumbNameMap = {
  '/': 'General',
  '/agency': 'Agency',
  '/agency/create': 'Create',
  '/register': 'Register',
  '/register/create': 'Create',
  '/setting': 'Setting',
};

const PMBreadcrumb = () => {
  const { asPath } = useRouter();
  if (asPath === '/') return null;

  const pathSnippets = asPath.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}` as keyof typeof breadcrumbNameMap;
    return {
      key: url,
      title: (
        <Link href={url}>{breadcrumbNameMap[url] || pathSnippets[pathSnippets.length - 1]}</Link>
      ),
    };
  });

  const breadcrumbItems = [{ key: '/', title: <Link href='/'>General</Link> }].concat(
    extraBreadcrumbItems,
  );

  return <AntdBreadcrumb items={breadcrumbItems} />;
};

export default PMBreadcrumb;
