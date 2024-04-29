import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import TextPostList from "@/components/shared/TextPostList";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";


function Saved() {
  const { data: currentUser, isPending } = useGetCurrentUser();

  const imagePosts = currentUser?.saves?.map((post: any) => post.posts.imageUrl && post.posts).filter((post: any) => post)
  const textPosts = currentUser?.saves?.map((post: any) => !post.posts.imageUrl && post.posts).filter((post: any) => post)

  return (
    <div className='flex w-full'>
      <div className='saved-container'>
        <div className='flex justify-start w-full gap-5'>
          <img src="/assets/icons/save.svg" alt="saved" width={30} height={30} className="invert-white" />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Saved Posts</h2>
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          <TextPostList posts={textPosts} />
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {isPending ? <Loader />
          : <GridPostList posts={imagePosts} />
          }
        </div>
      </div>
    </div>
  )
}

export default Saved