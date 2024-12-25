import Link from "next/link";
import Avatar from "../Components/helpers/Avatar";


export default function UserSearchCard({ user,onClose }) {
  return (
    <>
      <Link href={"/" + user?._id} onClick={onClose} className="flex bg-white overflow-scroll  items-center p-2 lg:p-4 border border-transparent border-b-slate-200 shadow-md rounded-lg hover:border-primary hover:scale-x-[1.03] transform transition duration-75 cursor-pointer">
        <div>
          <Avatar
            width={50}
            height={50}
            name={user?.name}
            imageUrl={user?.profile_pic}
            userId={user?._id}
          />
        </div>
        <div className="mt-2 ml-5 text-ellipsis line-clamp-1">
          <div className="font-semibold">{user?.name}</div>
          <p className="text-sm text-ellipsis line-clamp-1 ">{user?.email}</p>
        </div>
      </Link>
    </>
  );
}
