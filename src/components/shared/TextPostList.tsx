import { Link } from "react-router-dom";

type TextPostListProps = {
  posts: any[] | undefined;
  showUser?: boolean;
}

function TextPostList({ posts, showUser = true}: TextPostListProps) {
  return (
    <ul className="text-post-container">
      {posts?.map((post) => (
        <li key={post.id} className="text-post-link">
          <Link to={`/posts/${post.id}`}>
            <div className="flex-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="h-8 w-8 rounded-full"
                />
                <p className="base-medium lg-body-bold text-light-1">
                  {post.creator.name}
                </p>
              </div>
            </div>

            <div className="small-medium max-h-[80%] overflow-hidden py-4">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default TextPostList