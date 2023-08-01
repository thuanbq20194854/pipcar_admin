import styled from '@emotion/styled';
import { Form, Slider } from 'antd';
import { BsDashLg, BsPlusLg } from 'react-icons/bs';
import Button, { ButtonGroup } from '../button/Button';

function PointSlideFormItem() {
  const form = Form.useFormInstance();

  const increase = () => {
    const current = form.getFieldValue('point');
    let newCount = +current + 100;
    if (newCount > 1000) {
      newCount = 1000;
    }
    form.setFieldValue('point', newCount);
  };

  const decline = () => {
    const current = form.getFieldValue('point');
    let newCount = +current - 100;
    if (newCount < 0) {
      newCount = 0;
    }
    form.setFieldValue('point', newCount);
  };

  return (
    <StyledWrapper className='point-container'>
      <Form.Item name='point' label='Point' className='hide-error' tooltip='Coming soon...'>
        <Slider
          disabled
          step={100}
          max={1000}
          min={0}
          marks={{
            0: '0',
            500: '500',
            1000: { label: <strong>1000</strong> },
          }}
        />
      </Form.Item>
      <ButtonGroup size='small' className='point-actions'>
        <Button
          onClick={decline}
          icon={<BsDashLg />}
          disabled
          // disabled={formPointValue === 0}
        />
        <Button
          onClick={increase}
          icon={<BsPlusLg />}
          disabled
          // disabled={formPointValue === 1000}
        />
      </ButtonGroup>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
  .point-actions {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

export default PointSlideFormItem;
