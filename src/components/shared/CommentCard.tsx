import { multiFormatDateString } from "@/lib/utils";
import { Link } from "react-router-dom";

type CommentCardProps = {
  comment: any;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-3">
      <Link to={`/profile/${comment.creator.id}`} className="min-w-7">
        <img
          src={comment?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
          alt="creator"
          className="rounded-full w-7 h-7 object-cover"
        />
      </Link>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Link to={`/profile/${comment.creator.id}`} className="base-medium lg-body-bold text-light-1">
            {comment?.creator?.name}
          </Link>
          <p className="small-semibold lg:small-regular text-light-3">
            {multiFormatDateString(comment?.created_at)}
          </p>
        </div>

        <p className="small-regular text-light-2 p-1">
          {comment?.details}
        </p>
      </div>
    </div>
  )
}
