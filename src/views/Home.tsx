import {useEffect, useState} from 'react';
import useUserContext from '../hooks/contextHooks';
import {useFollow, useMedia} from '../hooks/apiHooks';
import {Follow, MediaItemWithProfilePicture} from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import SingleView from '../components/SingleView';

const Home = () => {
  const [activeFeed, setActiveFeed] = useState<'normal' | 'following'>(
    'normal',
  );
  const {user} = useUserContext();
  const {getFollowedUsers} = useFollow();
  const [followedMedia, setMedia] = useState<MediaItemWithProfilePicture[]>([]);
  const [selectedItem, setSelectedItem] = useState<
    MediaItemWithProfilePicture | undefined
  >(undefined);
  const {mediaArray} = useMedia();

  useEffect(() => {
    const fetchFollowed = async () => {
      const token = localStorage.getItem('token');
      if (!user || !token) return; // If no user is logged in, do nothing

      try {
        // Get the list of users that the logged-in user is following
        const followedUsers = await getFollowedUsers(token as string);
        console.log('Followed Users:', followedUsers); // Log followed users

        // Extract followed user IDs
        const followedIds = followedUsers.map(
          (follow: Follow) => follow.followed_id,
        );
        console.log('Followed IDs:', followedIds); // Log followed IDs

        // Filter the mediaArray to only include media from followed users
        const followedMedia = mediaArray.filter((media) =>
          followedIds.includes(media.user_id),
        );
        console.log('Followed media:', followedMedia); // Log followed media

        // Set the filtered media as the new followed media
        setMedia(followedMedia);
      } catch (error) {
        console.error('Error fetching followed users:', error);
      }
    };

    // Only fetch followed media when the feed is 'following' and we have a valid user
    if (activeFeed === 'following' && user) {
      fetchFollowed();
    } else {
      setMedia([]); // Clear followed media when switching to the normal feed
    }

    // Ensure this effect is triggered when the feed or user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFeed, user, mediaArray]); // Dependencies include activeFeed, user, and mediaArray

  return (
    <>
      <div className="flex flex-col items-center mb-20 p-4 h-4/5">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 text-lg font-semibold transition-all ${
              activeFeed === 'normal'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400'
            }`}
            onClick={() => setActiveFeed('normal')}
          >
            For You
          </button>

          {user && (
            <button
              className={`px-4 py-2 text-lg font-semibold transition-all ${
                activeFeed === 'following'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveFeed('following')}
            >
              Following
            </button>
          )}
        </div>

        <div className="w-full h-full rounded-md">
          {activeFeed === 'normal' ? (
            <>
              {selectedItem && (
                <SingleView
                  item={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              )}
              <section>
                {mediaArray.map((item) => (
                  <div key={item.media_id}>
                    <MediaRow item={item} setSelectedItem={setSelectedItem} />
                  </div>
                ))}
              </section>
            </>
          ) : (
            <>
              {user ? (
                <div className="w-full h-full rounded-md">
                  <section>
                    {selectedItem && (
                      <SingleView
                        item={selectedItem}
                        setSelectedItem={setSelectedItem}
                      />
                    )}
                    {followedMedia.map((item) => (
                      <div key={item.media_id}>
                        <MediaRow
                          item={item}
                          setSelectedItem={setSelectedItem}
                        />
                      </div>
                    ))}
                  </section>
                </div>
              ) : (
                <div>Please log in to see the Following feed</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
