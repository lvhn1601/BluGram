import CommentForm from "@/components/forms/CommentForm";
import CommentCard from "@/components/shared/CommentCard";
import ConfirmModal from "@/components/shared/ConfirmModal";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

function PostDetails() {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: deletePost, isError: deleteError } = useDeletePost();

  console.log(post)

  const handleDeletePost = async () => {
    await deletePost({
      postId: post.id,
      imagePath: post.imagePath
    })

    if (deleteError) {
      toast({
        title: 'Delete Post failed. Please try again!',
      })
      return;
    }

    navigate('/');
  }

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          {post?.imageUrl && 
            <img
              src={post?.imageUrl}
              alt="post"
              className="post_details-img"
            />
          }

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12 object-cover"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg-body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.created_at)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-2">
                {user.id === post?.creator.id && 
                  <>
                    <Link to={`/update-post/${post?.id}`}>
                      <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                    </Link>

                    <ConfirmModal
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. This will permanently delete this post from our servers."
                      onConfirm={handleDeletePost}
                    >
                      <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24}/>
                    </ConfirmModal>
                  </>
                }
              </div>
            </div>

            <hr className="border w-full border-dark-4/80"/>

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <div className="p-1">
                {post?.caption.split('\n').map((line: string, index: number) => (
                  <p key={index}>
                    {line}
                    <br />
                  </p>
                ))}
              </div>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>

              <div className="w-full pt-5">
                <PostStats post={post} userId={user.id} commentBtn={false} />
              </div>

              <div className="flex flex-col justify-between mt-6 p-5 bg-dark-3 rounded-lg gap-5">
                <ul className="max-h-[300px]">
                  {post?.comments.map((comment: any) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </ul>

                <CommentForm postId={post?.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails