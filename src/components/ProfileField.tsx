"use client";

import { useEffect, useState } from "react";
import { getProfile, type Profile } from "@/lib/profile";

/** Renders one of her stored profile fields (or a fallback) inside a server
 * component. Reads from the local profile store, so Settings shows her real
 * answers instead of mockup placeholders. */
export default function ProfileField({
  field,
  fallback = "",
}: {
  field: keyof Profile;
  fallback?: string;
}) {
  const [value, setValue] = useState("");
  useEffect(() => setValue(getProfile()[field] ?? ""), [field]);
  return <>{value || fallback}</>;
}
