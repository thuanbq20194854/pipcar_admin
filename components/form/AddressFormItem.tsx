import { Form, Select } from 'antd';
import { Fragment } from 'react';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from 'src/redux/query/provinces.query';
import { vietnameseSlug } from 'src/utils/utils';

function AddressFormItem() {
  const form = Form.useFormInstance();
  const formProvinceValue = Form.useWatch('province', form);
  const formDistrictValue = Form.useWatch('district', form);

  const selectedProvince = formProvinceValue?.value || undefined;
  const selectedDistrict = formDistrictValue?.value || undefined;

  const { data: getProvincesData, isFetching: getProvincesFetching } = useGetProvincesQuery({});
  const { data: getDistrictsData, isFetching: getDistrictsFetching } = useGetDistrictsQuery(
    selectedProvince,
    {
      skip: !selectedProvince,
      selectFromResult: ({ data, isFetching }) => ({ data: data?.districts || [], isFetching }),
    },
  );
  const { data: getWardsData, isFetching: getWardsFetching } = useGetWardsQuery(selectedDistrict, {
    skip: !selectedDistrict,
    selectFromResult: ({ data, isFetching }) => ({ data: data?.wards || [], isFetching }),
  });

  return (
    <Fragment>
      <Form.Item label='Province' rules={[{ required: true }]} name='province'>
        <Select
          placeholder='Select Province...'
          showSearch
          labelInValue
          optionFilterProp='children'
          filterOption={(input, option) =>
            vietnameseSlug(option?.label as string, ' ').indexOf(vietnameseSlug(input, ' ')) >= 0
          }
          onSelect={() => form.setFieldsValue({ district: undefined, ward: undefined })}
          loading={getProvincesFetching}
          options={(getProvincesData || []).map(({ code, name }) => ({
            label: name,
            value: code,
          }))}
        />
      </Form.Item>
      <Form.Item
        label='District'
        rules={[{ required: true }]}
        name='district'
        shouldUpdate={!!selectedProvince}
      >
        <Select
          disabled={!selectedProvince}
          placeholder='Select District...'
          showSearch
          labelInValue
          optionFilterProp='children'
          filterOption={(input, option) =>
            vietnameseSlug(option?.label as string, ' ').indexOf(vietnameseSlug(input, ' ')) >= 0
          }
          onSelect={() => form.setFieldsValue({ ward: undefined })}
          loading={getDistrictsFetching}
          options={getDistrictsData.map(({ code, name }) => ({
            label: name,
            value: code,
          }))}
        />
      </Form.Item>
      <Form.Item
        label='Ward'
        rules={[{ required: true }]}
        name='ward'
        shouldUpdate={!!selectedDistrict}
      >
        <Select
          disabled={!selectedDistrict}
          placeholder='Select Ward...'
          showSearch
          labelInValue
          optionFilterProp='children'
          filterOption={(input, option) =>
            vietnameseSlug(option?.label as string, ' ').indexOf(vietnameseSlug(input, ' ')) >= 0
          }
          loading={getWardsFetching}
          options={getWardsData.map(({ code, name }) => ({
            label: name,
            value: code,
          }))}
        />
      </Form.Item>
    </Fragment>
  );
}

export default AddressFormItem;
