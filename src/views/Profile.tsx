import {useEffect, useState} from 'react';
import useUserContext from '../hooks/contextHooks';
import {Link, useNavigate} from 'react-router-dom';
import {useFollow} from '../hooks/apiHooks';
import { useMedia } from '../hooks/apiHooks';

const Profile = () => {
  const {user} = useUserContext();
  const navigate = useNavigate();
  const {getFollowedUsers, getFollowers} = useFollow();

  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  const token = localStorage.getItem('token') || '';
  const {mediaArray} = useMedia(token);

  useEffect(() => {
    const fetchFollowData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        const userFollows = await getFollowedUsers(token);
        const userFollowers = await getFollowers(token);

        setFollowerCount(userFollowers.length);
        setFollowingCount(userFollows.length);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchFollowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Refetch when the user context changes

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-2/3  p-6">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 flex flex-col items-center space-y-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt=""
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
            <div className="text-white absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-400">
              Edit
            </div>
          </div>

          {/* Username */}
          <h2 className="text-3xl font-bold text-gray-800">{user?.username}</h2>

          {/* User Role */}
          <p className="text-gray-600 text-lg">{user?.level_name}</p>

          {/* Media or Posts Section */}
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Posts</p>
              <p className="font-semibold text-xl">{mediaArray.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Followers</p>
              <p className="font-semibold text-xl">{followerCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Following</p>
              <p className="font-semibold text-xl">{followingCount}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full mt-4 flex justify-center space-x-4">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition duration-200">
              Edit Profile
            </button>
            <Link to="/logout">
              <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition duration-200">
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center min-h-1/2 bg-gray-900 p-4 my-20">
        <h2 className="text-2xl font-semibold text-gray-400 text-center mb-6">
          Your uploads
        </h2>
        <div className="flex flex-wrap items-start justify-center">
          {mediaArray.map((item) => (
            <div key={item.media_id} className="m-2">
              <img
                onClick={() => navigate('/single', {state: {item}})}
                className="w-64 h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-101"
                src={
                  item.filename ||
                  (item.screenshots && item.screenshots[0]) ||
                  undefined
                }
                alt={item.title}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
