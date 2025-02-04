'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameLink } from './game-link';
import MyPageTableView from './mypage-table';
import { Button } from '@/components/ui/button';

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export default function MyPageTable() {
  const router = useRouter();
  const [data, setData] = useState<UserRegister[]>([]);
  const [tag, setTag] = useState<AdminRegisterUsers[]>([]);
  const [totalData, setTotalData] = useState<number>(0); // Store total items for pagination
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userInfo.token) {
          throw new Error("User not authenticated.");
        }

        setLoading(true);

        const response = await fetch('/api/customer/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}` // Assuming the token is sent this way
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        setTag(result.data)
        setData(result.data[0].register); // Adjust based on your API response
        setTotalData(result.totalCount); // Adjust based on your API response

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userInfo]);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  const requestSuccess = () => {
    router.push("/mypage/register");
  }

  // Filter the data for status "complete"
  const filteredData = data.filter((item) => item.status === "complete");

  return (
    <div className="space-y-4">
      <p className='text-md font-medium ml-10'>Your Tag Number</p>
      <p className='text-xl font-bold ml-14'>#{tag[0].tag}</p>
      <p className='py-5 text-medium font-bold text-center'>Login Info</p>
      <MyPageTableView columns={columns} data={filteredData} totalItems={filteredData.length} />
      <div className='flex justify-center py-8'>
        <Button variant='default' handleClick={requestSuccess} className='text-white'>Request Game Register</Button>
      </div>
      <div>
        <p className='text-center text-xl font-semibold'>User Info</p>
        <div className='border py-8 mt-3'>
          <div className='flex justify-center'>
            <p>Name:</p>
            <p className='ml-2'>{tag[0].firstname}{" "}{tag[0].lastname}</p>
          </div>
          <div className='flex justify-center'>
            <p>Email:</p>
            <p className='ml-2'>{tag[0].email}</p>
          </div>
          <div className='flex justify-center'>
            <p>Phone Number:</p>
            <p className='ml-2'>{data[0] ? data[0].phonenumber : "None"}</p>
          </div>
        </div>
      </div>
      <GameLink />
    </div>
  );
}
