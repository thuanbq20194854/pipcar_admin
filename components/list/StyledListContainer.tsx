import styled from '@emotion/styled';
import { Affix, List, ListProps, Pagination, PaginationProps, theme } from 'antd';
import { useState } from 'react';
import { TMetaBase } from 'src/types/response.types';

type TPagination = PaginationProps & { metadata?: TMetaBase };

type TProps<TItem> = Omit<ListProps<TItem>, 'pagination'> & {
  pagination?: TPagination;
};
function StyledListContainer<TItem>({ pagination, ...props }: TProps<TItem>) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [affixedPagination, setAffixedPagination] = useState<boolean>();

  return (
    <ListContainer>
      <List<TItem> style={{ backgroundColor: colorBgContainer }} pagination={false} {...props} />
      {!!pagination?.metadata && (
        <Affix offsetBottom={0.001} onChange={(affixed) => setAffixedPagination(affixed)}>
          <Pagination
            style={{
              backgroundColor: colorBgContainer,
            }}
            className={affixedPagination ? 'affixed' : ''}
            total={pagination.metadata.total || 0}
            pageSize={pagination.metadata.limit}
            current={pagination.metadata.page}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            defaultPageSize={10}
            showSizeChanger={true}
            pageSizeOptions={['2', '10', '20', '30', '50']}
            {...pagination}
          />
        </Affix>
      )}
    </ListContainer>
  );
}

const ListContainer = styled.div`
  .list-header {
    padding: 0 24px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list-header-item {
    color: #8e8e8e;
  }
  .list-header-item:first-of-type span {
    font-size: 14px;
  }
  .ant-list {
    border-radius: 8px 8px 0 0;
    padding: 0 24px;
  }
  .ant-list-item-meta-avatar {
    align-self: center;
  }
  .ant-tag {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }
  .ant-typography,
  .ant-typography-copy {
    color: currentColor;
  }
  .ant-affix {
    height: fit-content !important;
  }
  .ant-pagination {
    padding: 12px 24px 24px;
    display: flex;
    align-items: center;
    border-radius: 0 0 8px 8px;
    .ant-pagination-total-text {
      margin-right: auto;
    }
    &.affixed {
      border-radius: 0;
      border-top: 1px solid rgba(5, 5, 5, 0.06);
      padding-bottom: 12px;
    }
  }
  .ant-segmented-status {
    .ant-segmented-group label {
      color: #8e8e8e;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.lock .ant-segmented-item-selected {
      color: red;
    }
    &.unlock .ant-segmented-item-selected {
      color: ${({ theme }) => theme.generatedColors[6]};
    }
  }

  .ant-list-item-meta-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-name {
    color: ${({ theme }) => theme.colorPrimary} !important;
    font-weight: 500;
    &:hover {
      text-decoration: underline !important;
    }
  }
`;

export default StyledListContainer;
