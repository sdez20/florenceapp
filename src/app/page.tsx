export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-sand sm:p-6">
      {/* The screen — fills the phone on mobile, a centered card on larger displays */}
      <div className="relative flex min-h-dvh w-full max-w-[390px] flex-col bg-paper px-[38px] pb-11 sm:min-h-0 sm:h-[min(844px,92vh)] sm:rounded-[44px] sm:shadow-[0_40px_120px_rgba(58,53,46,0.30),0_0_0_1px_rgba(92,107,67,0.18)]">
        {/* Upper: the name, centered in generous space */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="font-serif text-[58px] font-medium leading-none tracking-[0.01em] text-ink">
            Florence
          </h1>
        </div>

        {/* Lower: the invitation */}
        <div className="flex flex-col items-center text-center">
          <button
            type="button"
            className="w-full rounded-[18px] border-[1.5px] border-olive bg-ink p-[18px] font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-paper transition-[transform,background-color] duration-300 hover:-translate-y-px hover:bg-olive focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-clay"
          >
            Begin
          </button>
          <p className="mt-[18px] text-[13.5px] font-normal text-ink-soft">
            Already with Florence?{" "}
            <a href="#" className="font-semibold text-clay no-underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
