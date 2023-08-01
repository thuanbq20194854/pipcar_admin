import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { useRouter } from 'next/router';
import Link from 'src/components/next/Link';

const breadcrumbNameMap = {
  '/admin': 'General',
  '/admin/partner': 'Partner Manager',
  '/admin/partner/create': 'Create',
  '/admin/setting': 'Cài đặt',
};

const AdminBreadcrumb = () => {
  const { asPath } = useRouter();
  if (asPath === '/admin') return null;

  const pathSnippets = asPath.split('/').filter((i) => i);

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}` as keyof typeof breadcrumbNameMap;
    return { key: url, title: <Link href={url}>{breadcrumbNameMap[url] || pathSnippets[2]}</Link> };
  });

  return <AntdBreadcrumb items={breadcrumbItems} />;
};

export default AdminBreadcrumb;
