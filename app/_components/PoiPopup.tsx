import { useCallback } from "react";
import { Coordinates } from "../_utils/coordinateMath";
import { Pin } from "../_utils/global";
import { PoiCard } from "./PoiCard";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PoiPopup({
  id,
  payload,
  setShowPopup,
  userCoordinates,
  setScore,
  setCheckLevel,
}: {
  id: number;
  payload: Pin;
  setShowPopup: (arg0: boolean) => void;
  userCoordinates: Coordinates | null;
  setScore: (arg0: number | null) => void;
  setCheckLevel: (arg: boolean) => void;
}): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // close popup will set poiIdOpen param to "" in URL
  const removePoiIdQueryString = useCallback((): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("poiIdOpen", "");

    return params.toString();
  }, [searchParams]);

  // RETURN
  return (
    <main className="flex h-svh flex-col items-center justify-between">
      <Dialog defaultOpen>
        <DialogTrigger />
        <DialogContent
          onClick={() => {
            setShowPopup(false);
            router.push(pathname + "?" + removePoiIdQueryString());
          }}
        >
          <PoiCard
            setCheckLevel={setCheckLevel}
            id={id}
            payload={payload}
            setShowPopup={setShowPopup}
            userCoordinates={userCoordinates}
            setScore={setScore}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
