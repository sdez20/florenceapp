import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta } from "@/components/ui";

export default function Home() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-[38px] pb-11">
        {/* Upper: the name, centered in generous space */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="font-serif text-[58px] font-medium leading-none tracking-[0.01em] text-ink">
            Florence
          </h1>
        </div>

        {/* Lower: the invitation */}
        <div className="flex flex-col items-center text-center">
          <Link href="/consent" className={cta}>
            Begin
          </Link>
          <p className="mt-[18px] text-[13.5px] font-normal text-ink-soft">
            Already with Florence?{" "}
            <a href="#" className="font-semibold text-clay no-underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
