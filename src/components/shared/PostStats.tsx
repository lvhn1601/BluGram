import { useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

type PostStatsProps = {
  post: any;
  userId: string;
  commentBtn: boolean;
}

function PostStats({ post, userId, commentBtn }: PostStatsProps) {
  const likesList = post?.post_likes.map((user: any) => user.userId);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const { mutate: savePost, isPending: isSaving } = useSavePost();

  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.saves.find((record: any) => record.postId === post?.id)

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  useEffect(() => {
    setLikes(likesList)
  }, [post])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    const hadLiked = likes.includes(userId);

    likePost({ userId, postId: post?.id, liked: hadLiked })
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    savePost({ userId, postId: post?.id, liked: savedPostRecord })
  }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex">
        <div className="flex gap-2 mr-5">
          {isLiking ? <Loader />
          : <img
              src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
              onClick={handleLikePost}
              className="cursor-pointer"
            />
          }
          <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        {commentBtn &&
          <div className="flex gap-2 mr-5">
            <img
              src={"/assets/icons/chat.svg"}
              alt="like"
              width={20}
              height={20}
              onClick={() => {navigate(`/posts/${post.id}`)}}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{post?.comments.length}</p>
          </div>
        }
      </div>

      <div className="flex gap-2 mr-5">
        {isSaving
        ? <Loader />
        : <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
      }
      </div>
    </div>
  )
}

export default PostStats