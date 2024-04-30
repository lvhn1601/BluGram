import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

type UserCardProps = {
  user: any;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();

  const followed = user?.followers.map(
    (follower: any) => follower.users
  ).some((flwer: any) => flwer.id === currentUser?.id);

  return (
    <Link to={`/profile/${user.id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14 object-cover"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button
        type="button"
        className={`${
          followed ? "shad-button_dark_4" : "shad-button_primary"
        } px-8`}
      >
        {followed ?
          "Following" :
          "Follow"
        }
      </Button>
    </Link>
  );
};

export default UserCard;