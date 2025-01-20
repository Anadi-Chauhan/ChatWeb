import Avatar from "@/app/Components/helpers/Avatar";

export default function GuestUserSearchCard({ user }) {
  return (
    <>
      <div className="flex bg-white overflow-scroll  items-center p-1 border border-transparent border-b-slate-200 shadow-md hover:border-primary hover:scale-x-[1.03] transform transition duration-75 cursor-pointer">
        <div className="ml-2" >
          <Avatar
            width={35}
            height={35}
            name={user?.name}
          />
        </div>
        <div className="mt-1 ml-3 text-ellipsis line-clamp-1">
          <div className="font-semibold text-sm">{user?.name}</div>
          <div className="flex" >
          <p className="text-xs">{user?.gender},</p>
          <p className="text-xs"> {user?.age}</p>
          </div>
        </div>
      </div>
    </>
  );
}
