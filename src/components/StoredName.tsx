"use client";

import { useEffect, useState } from "react";
import { getStoredName, firstNameOf } from "@/lib/user";

/** Renders the user's stored name (or a fallback), for use inside server components. */
export default function StoredName({
  fallback = "",
  first = false,
}: {
  fallback?: string;
  first?: boolean;
}) {
  const [name, setName] = useState("");
  useEffect(() => setName(getStoredName()), []);
  const display = first ? firstNameOf(name) : name;
  return <>{display || fallback}</>;
}
