import { PropsWithChildren, useEffect } from "react";
import { usePathname } from "expo-router";
import * as plausible from "~/utils/plausible";

export default function PlausibleProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();

  useEffect(() => {
    plausible.capture("pageview", pathname);
  }, [pathname]);

  return children;
}
