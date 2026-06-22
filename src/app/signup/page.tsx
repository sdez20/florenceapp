import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";
import { cta, eyebrow } from "@/components/ui";

const fields = [
  { id: "name", label: "First and last name", type: "text", placeholder: "Your name" },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { id: "pass", label: "Password", type: "password", placeholder: "Create a password" },
];

const inputClass =
  "w-full rounded-[14px] border-[1.5px] border-olive/22 bg-transparent px-[18px] py-4 font-sans text-[15px] text-ink transition-colors placeholder:text-ink-soft/55 focus:border-clay focus:outline-none";

export default function SignupPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-8 pt-16">
        <BackLink href="/consent" />

        <div className="flex flex-1 flex-col justify-center py-[18px]">
          <p className={`${eyebrow} mb-[14px] tracking-[0.3em]`}>Florence</p>
          <h1 className="mb-11 font-serif text-[38px] font-medium leading-[1.08] text-ink">
            Create your space.
          </h1>

          <div className="flex flex-col gap-5">
            {fields.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block pl-0.5 text-[12px] font-medium tracking-[0.04em] text-ink-soft"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        <Link href="/onboarding" className={`${cta} mt-auto`}>
          Create my account
        </Link>
        <p className="mt-5 text-center text-[13.5px] text-ink-soft">
          Already with Florence?{" "}
          <a href="#" className="font-semibold text-clay no-underline">
            Sign in
          </a>
        </p>
      </div>
    </PhoneFrame>
  );
}
