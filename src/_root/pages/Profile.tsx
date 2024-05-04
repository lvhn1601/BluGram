import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useFollowUser,
  useGetUserByUsername,
} from "@/lib/react-query/queriesAndMutations";
import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import LikedPosts from "./LikedPost";
import UsersModal from "@/components/shared/UsersModal";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { username } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserByUsername(username || "");
  const { mutate: followUser, isPending: isLoadingFollow } = useFollowUser();

  const followers = currentUser?.followers.map(
    (follower: any) => follower.users
  );
  const followings = currentUser?.followings.map(
    (follower: any) => follower.users
  );

  const followed = followers?.some((flwer: any) => flwer.id === user?.id);

  const handleFollow = () => {
    followUser({
      followed,
      userId: currentUser.id,
      followBy: user.id,
      username: currentUser.username,
    });
  };

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 object-cover rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <UsersModal title="Followers" users={followers}>
                <StatBlock
                  value={currentUser.followers.length}
                  label="Followers"
                />
              </UsersModal>
              <UsersModal title="Followings" users={followings}>
                <StatBlock
                  value={currentUser.followings.length}
                  label="Following"
                />
              </UsersModal>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.id && "hidden"}`}>
              <Link
                to={`/update-profile/${username}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === currentUser.id && "hidden"}`}>
              <Button
                type="button"
                className={`${
                  followed ? "shad-button_dark_4" : "shad-button_primary"
                } px-8`}
                onClick={handleFollow}
                disabled={isLoadingFollow}
              >
                {isLoadingFollow ? (
                  <Loader />
                ) : followed ? (
                  "Following"
                ) : (
                  "Follow"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${username}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${username}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${username}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${username}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser?.posts} showUser={false} />}
        />
        {currentUser.id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
