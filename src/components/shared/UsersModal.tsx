import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Link } from "react-router-dom";

type UsersModalProps = {
  children: React.ReactNode;
  title: string;
  users: any[];
}

export function UsersModal({ children, title, users }: UsersModalProps) {
 
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-dark-2 border-none h-full md:h-96 flex flex-col">
        <DialogHeader className="flex flex-row justify-center w-full pb-2">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ul className="flex flex-col overflow-y-scroll h-full justify-start px-5 custom-scrollbar">
          {users.map((user: any) => (
            <li key={user.id} className="w-full my-1">
              <Link to={`/profile/${user.id}`} className="flex flex-row items-center gap-3 w-full hover:bg-dark-3 rounded-md p-2">
                <img 
                  src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <h4 className="text-light-1 base-semibold">{user.name}</h4>
                  <p className="text-light-2 small-regular">@{user.username}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default UsersModal;