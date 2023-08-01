import styled from '@emotion/styled';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { IoMdCar } from 'react-icons/io';
import { MdEmojiPeople, MdEmojiTransportation } from 'react-icons/md';
import WithAuth from 'src/hooks/withAuth';

function Page() {
  return (
    <PageWrapper className='main-page'>
      <CardWrapper>
        <div className='role-name'>
          Agency
          <HiOutlineBuildingOffice2 className='role-avatar' size={28} />
        </div>
        <div className='role-count'>
          200
          <Link
            className='link'
            href={{
              pathname: '/agency',
              query: { tab: 'isAgency_true_status_1' },
            }}
            as='/agency'
          >
            <FaArrowRight size={40} className='role-arrow' />
          </Link>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className='role-name'>
          Driver
          <IoMdCar className='role-avatar' size={28} />
        </div>
        <div className='role-count'>
          200
          <Link
            className='link'
            href={{
              pathname: '/agency',
              query: { tab: 'isDriver_true_status_1' },
            }}
            as='/agency'
          >
            <FaArrowRight size={40} className='role-arrow' />
          </Link>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className='role-name'>
          Transportation
          <MdEmojiTransportation className='role-avatar' size={28} />
        </div>
        <div className='role-count'>
          200
          <Link
            className='link'
            href={{
              pathname: '/agency',
              query: { tab: 'isTransportation_true_status_1' },
            }}
            as='/agency'
          >
            <FaArrowRight size={40} className='role-arrow' />
          </Link>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className='role-name'>
          New Register
          <MdEmojiPeople className='role-avatar' size={28} />
        </div>
        <div className='role-count'>
          20
          <Link
            className='link'
            href={{
              pathname: '/register',
            }}
            as='/register'
          >
            <FaArrowRight size={40} className='role-arrow' />
          </Link>
        </div>
      </CardWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  display: flex;
  flex-wrap: wrap;
`;

const CardWrapper = styled.main`
  border: 1px solid white;
  border-radius: 10px;
  height: 175px;
  width: 30%;
  margin: 1%;
  background-color: white;
  .role-arrow {
    border: 1px blue;
    border-radius: 50%;
    background-color: #dbdbff;
    padding: 5px;
  }
  .role-name {
    margin: 10px 0 0 20px;
    font-size: 30px;
    font-weight: 450;
  }
  .role-avatar {
    margin: 10px 15px;
    padding: 3px;
    float: right;
    color: #5d5dfe;
    background-color: #dbdbff;
    border: 1px solid #dbdbff;
    border-radius: 50%;
    scale: 150%;
  }
  .role-count {
    position: relative;
    font-size: 80px;
    font-weight: 700;
    margin: 0 0 0 20px;
    .link {
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0 10px 40px 0;
      font-size: 30px;
      height: 35px;
    }
  }
`;

export default WithAuth(Page);
