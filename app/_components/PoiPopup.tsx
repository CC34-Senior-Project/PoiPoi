import { PoiCard } from "./PoiCard";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/_components/ui/dialog";

export default function PoiPopup({
  id,
  payload,
}: {
  id: number;
  payload: {
    id: number;
    latitude: number;
    longitude: number;
    radius: number;
    title: string;
    description: string;
    img_url: string;
    is_main_attraction: boolean;
    tags: string[];
  };
}): JSX.Element {
  // RETURN
  return (
    <main className="flex h-screen flex-col items-center justify-between">
      <Dialog defaultOpen>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <PoiCard id={id} payload={payload} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
