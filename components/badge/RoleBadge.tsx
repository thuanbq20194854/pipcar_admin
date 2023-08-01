import styled from '@emotion/styled';
import { Badge, BadgeProps } from 'antd';
import { BsCheckLg, BsShieldShaded } from 'react-icons/bs';

function RoleBadge({ children, role, count, ...props }: BadgeProps & { role?: string }) {
  return (
    <Badge
      count={
        !!role ? (
          <StyledCount>
            {role === 'ADMIN' ? <BsShieldShaded size={10.2} /> : <BsCheckLg size={10} />}
          </StyledCount>
        ) : (
          count
        )
      }
      {...props}
    >
      {children}
    </Badge>
  );
}

const StyledCount = styled.div`
  color: #fafafa;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.generatedColors[4]};
  width: 16px;
  height: 16px;
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export default RoleBadge;
