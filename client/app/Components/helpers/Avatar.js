import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Avatar({ userId, name, imageUrl, width, height }) {

  const onlineUser = useSelector((state)=>state?.user?.onlineUser)

  let avatarName = "";

  if (name) {
    const splitName = name.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    'bg-slate-200',
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
  ]

  const randomNumber = Math.floor(Math.random() * 5)

  const isOnline = onlineUser.includes(userId)

  return (
    <div className={`text-slate-800 rounded-full shadow text-xl font-bold relative ${bgColor[randomNumber]}`} style={{ width: width + "px", height: height + "px", fontSize: width/2.5 + "px" }}>
      <div   className="overflow-hidden rounded-full w-full h-full flex justify-center items-center"
        style={{ width: width + "px", height: height + "px" }} >
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className="overflow-hidden rounded-full flex justify-center items-center"
        >
          {avatarName}
        </div>
      ) : (
        <FaUserCircle size={70} />
      )}
      </div>
      {
        isOnline && (
          <div className="bg-green-500 p-[6px] absolute bottom-1 right-0 z-10 rounded-full " ></div>
        )}

    </div>
  );
}
