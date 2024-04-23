import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite"
import { Link } from "react-router-dom";

type CommentCardProps = {
  comment: Models.Document;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-3">
      <Link to={`/profile`} className="min-w-7">
        <img
          src={comment?.user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
          alt="creator"
          className="rounded-full w-7 h-7"
        />
      </Link>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Link to={`/profile`} className="base-medium lg-body-bold text-light-1">
            {comment?.user?.name}
          </Link>
          <p className="small-semibold lg:small-regular text-light-3">
            {multiFormatDateString(comment?.$createdAt)}
          </p>
        </div>

        <p className="small-regular text-light-2 p-1">
          {comment?.details}
        </p>
      </div>
    </div>
  )
}
