import { compactString } from "@/lib/utils";
import { Link } from "react-router-dom";

type GridPostListProps = {
  posts: any[] | undefined;
  showUser?: boolean;
}

function GridPostList({ posts, showUser = true }: GridPostListProps) {
  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.id} className="relative min-w-80 aspect-square">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            {post.imageUrl
              ? <img src={post.imageUrl} alt="post" className="h-full w-full object-cover" />
              : <div className="flex justify-center p-6 h-full w-full">
                <div className="flex items-center text-center justify-center h-full w-full text-light-2 overflow-hidden">
                  {compactString(post.caption, 300)}
                </div>
              </div>
            }
          </Link>

          {showUser && (
            <div className="grid-post_user">
              <div className="flex items-center justify-start gap-2 flex-1">
                <img src={post.creator.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator" className="h-8 w-8 rounded-full" />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default GridPostList