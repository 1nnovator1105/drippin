export default function Header({ title }: { title: string }) {
  return (
    <div className="sticky top-0 flex flex-col w-full bg-[#FFFFFF] text-xl justify-center items-center h-[40px] border-b-[1px] border-[#D9D9D9]">
      {title}
    </div>
  );
}
