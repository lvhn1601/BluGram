import Loader from "./Loader";
import GridPostList from "./GridPostList";
import TextPostList from "./TextPostList";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
}

function SearchResults({ isSearchFetching, searchedPosts }: SearchResultsProps) {
  if (isSearchFetching) return <Loader />

  const imagePosts = searchedPosts.map((post: any) => post.imageUrl && post).filter((post: any) => post)
  const textPosts = searchedPosts.map((post: any) => !post.imageUrl && post).filter((post: any) => post)

  if (searchedPosts && searchedPosts.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        <TextPostList posts={textPosts} />
        <GridPostList posts={imagePosts} />
      </div>
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found!</p>
  )
}

export default SearchResults