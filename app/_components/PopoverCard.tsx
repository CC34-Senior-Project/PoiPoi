import { Popover, PopoverContent } from "@radix-ui/react-popover";
import PoiPopup from "./PoiPopup";
import { Pin } from "../_utils/global";
import { Coordinates } from "../_utils/coordinateMath";

const PopoverCard = ({
  poiData,
  selectedPoiId,
  setShowPopup,
  userCoordinates,
  setScore,
  setCheckLevel,
}: {
  poiData: Pin[];
  selectedPoiId: number;
  setShowPopup: (arg0: boolean) => void;
  userCoordinates?: Coordinates | null;
  setScore: (arg0: number | null) => void;
  setCheckLevel: (arg: boolean) => void;
}) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <Popover defaultOpen>
        <PopoverContent>
          {setShowPopup && userCoordinates && (
            <PoiPopup
              setCheckLevel={setCheckLevel}
              id={selectedPoiId}
              setShowPopup={setShowPopup}
              payload={poiData.filter((pin) => pin.poi_id === selectedPoiId)[0]}
              userCoordinates={userCoordinates}
              setScore={setScore}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PopoverCard;
