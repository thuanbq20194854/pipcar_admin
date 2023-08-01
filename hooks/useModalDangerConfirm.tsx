import styled from '@emotion/styled';
import { ModalFuncProps, Progress, Tooltip, Typography } from 'antd';
import useApp from './useApp';

type TProps = ModalFuncProps;

export default function useModalDangerConfirm({ onOk, ...props }: TProps) {
  const { modal: Modal } = useApp();
  const handleConfirm = (id?: string, title?: string, actionString = 'delete') => {
    let secondsToGo = 5;
    const modal = Modal.confirm({
      title: (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 416, margin: 0 }}>
          Are you sure {actionString}{' '}
          <Typography.Text type='danger'>{!!title ? title : id}</Typography.Text> ?
        </Typography.Paragraph>
      ),
      icon: null,
      content: null,
      okText: 'Confirm',
      cancelText: 'Cancel',
      cancelButtonProps: { size: 'middle' },
      okButtonProps: { size: 'middle', danger: true },
      bodyStyle: { position: 'relative' },
      onOk: () => onOk?.(id),
      ...props,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: (
          <>
            This modal will be destroyed after {secondsToGo} second.
            <ProgressWrapper>
              <Tooltip
                title={`This modal will be destroyed after ${secondsToGo} second.`}
                placement='bottomLeft'
              >
                <Progress
                  status='active'
                  strokeColor={{
                    from: '#f5222d',
                    to: '#ff7a45',
                  }}
                  percent={(secondsToGo / 5) * 100}
                  width={36}
                  type='circle'
                  showInfo
                  format={(percent) => `${secondsToGo}s`}
                />
              </Tooltip>
            </ProgressWrapper>
          </>
        ),
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000 - 1);
  };
  return { handleConfirm };
}

const ProgressWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;
