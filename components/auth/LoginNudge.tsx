import KakaoButton from "@/app/auth/callback/kakao-button";
import AnimatedCoffeeIcon from "../icon/AnimatedCoffeeIcon";
import GoogleButton from "@/app/auth/callback/google-button";

export default function LoginNudge() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <AnimatedCoffeeIcon className="size-10" />
      <div className="flex flex-col items-center justify-center text-center font-bold text-2xl">
        <div>서비스를 이용하려면</div>
        <div>로그인이 필요해요</div>
      </div>
      <KakaoButton />
      <GoogleButton />
    </div>
  );
}
