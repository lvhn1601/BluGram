import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";


function Saved() {
  const { data: currentUser, isPending } = useGetCurrentUser();

  const posts = currentUser?.saves?.map((post: any) => post.posts)

  return (
    <div className='flex w-full'>
      <div className='saved-container'>
        <div className='flex justify-start w-full gap-5'>
          <img src="/assets/icons/save.svg" alt="saved" width={30} height={30} className="invert-white" />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Saved Posts</h2>
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {isPending ? <Loader />
          : <GridPostList posts={posts} />
          }
        </div>
      </div>
    </div>
  )
}

export default Saved