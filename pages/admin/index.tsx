import { Typography } from 'antd';
import WithAdmin from 'src/hooks/withAdmin';
import { useAppSelector } from 'src/redux/store';

function HomePage() {
  const { data: userState } = useAppSelector((s) => s.user);

  return <Typography.Paragraph>ADMIN:{JSON.stringify(userState)}</Typography.Paragraph>;
}

export default WithAdmin(HomePage);
