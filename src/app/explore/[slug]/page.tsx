import Link from "next/link";
import { notFound } from "next/navigation";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";
import { cta } from "@/components/ui";
import { domains, getDomain } from "@/lib/domains";

export function generateStaticParams() {
  return domains.map((d) => ({ slug: d.slug }));
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const domain = getDomain(slug);
  if (!domain) notFound();

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-[30px] pb-[30px] pt-14">
        <BackLink href="/explore" />

        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.26em] text-clay">
            Explore
          </p>
          <h1 className="mb-[22px] font-serif text-[38px] font-medium leading-[1.05] text-ink">
            {domain.title}
          </h1>
          <p className="text-[15px] font-light leading-[1.7] text-ink-soft">
            {domain.desc}
          </p>
        </div>

        <Link href="/chat" className={`${cta} flex-shrink-0`}>
          Talk with Florence about this
        </Link>
      </div>
    </PhoneFrame>
  );
}
