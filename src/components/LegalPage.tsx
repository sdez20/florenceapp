import { promises as fs } from "fs";
import path from "path";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";
import Markdown from "@/components/Markdown";

// Reads markdown from src/content/legal at request time (Node runtime).
export default async function LegalPage({
  file,
  backHref = "/settings",
}: {
  file: string;
  backHref?: string;
}) {
  const content = await fs.readFile(
    path.join(process.cwd(), "src/content/legal", file),
    "utf8",
  );
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-10 pt-14">
        <BackLink href={backHref} />
        <div className="mt-4">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </PhoneFrame>
  );
}
