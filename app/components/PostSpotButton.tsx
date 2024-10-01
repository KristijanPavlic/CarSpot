import Link from "next/link";

const PostSpotButton = () => {
  return (
    <Link
      href="/upload"
      aria-label="Post a spot"
      title="Post a spot"
      className="flex justify-center items-center bg-[#BBD01A] rounded-full h-10 px-2 sticky w-fit float-right right-5 bottom-6 z-[99999] transition duration-300 ease-in-out hover:bg-[#D9D9D9]"
    >
      <span className="material-symbols-outlined">directions_car</span>
      <span className="material-symbols-outlined">add</span>
    </Link>
  );
};

export default PostSpotButton;
