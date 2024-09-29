import Image from "next/image";

interface Props {
  title: string;
  handle: string;
}

export default function DefaultThumbnail({ title, handle }: Props) {
  return (
    <div className="relative w-full h-[170px]">
      <Image
        src={"/assets/images/default.png"}
        alt="recipe"
        className="w-full h-full object-cover"
        fill
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black justify-center items-center flex text-center flex-col opacity-70">
        <p className="text-white text-lg font-bold">{title}</p>
        <p className="text-white text-sm">@{handle}</p>
      </div>
    </div>
  );
}
