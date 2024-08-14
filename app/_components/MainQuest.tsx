import { useContext, useEffect, useState } from "react";
import { FaMapPin } from "react-icons/fa";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "./ui/drawer";
// import DrawerCloseButton from "./ui/drawerCloseButton";
import { Pin } from "../_utils/global";
import { ImportantPinContext } from "./useContext/ImportantPinContext";
import { useMap } from "react-map-gl/maplibre";

interface MainQuestProps {
  closestNotCompletedPin: Pin | null;
}

const MainQuest = ({ closestNotCompletedPin: closestPin }: MainQuestProps) => {
  const trackingPinContext = useContext(ImportantPinContext);
  const [pinToPanTo, setPinToPanTo] = useState<Pin | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const { gameMap } = useMap();

  useEffect(() => {
    if (!trackingPinContext || !trackingPinContext?.trackingPin) {
      setIsTracking(false);
      setPinToPanTo(closestPin);
      return;
    }
    setPinToPanTo(trackingPinContext.trackingPin);
    setIsTracking(true);
  }, [trackingPinContext?.trackingPin, closestPin]);

  const handlePanMapToTrackingPin = (pin: Pin) => {
    try {
      if (!gameMap) throw "Can't find map";
      gameMap.flyTo({
        center: [pin.search_longitude, pin.search_latitude],
        duration: 1000,
        zoom: 17,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenderMainQuestText = (pin: Pin): string => {
    if (isTracking) return `Tracking the ${pin.title} POI`;
    return `The closest POI is ${pin.title}`;
  };

  return (
    <div
      id="mainQuest"
      className="fixed w-screen h-16 top-0 left-0 z-50 p-0 m-0 flex justify-between"
      onClick={() => {
        if (pinToPanTo) handlePanMapToTrackingPin(pinToPanTo);
      }}
    >
      {/* <div className="w-[48px] h-[48px] shrink-0 rounded-full border-mix p-1">
        <div className="w-full h-full bg-white rounded-full z-50"></div>
      </div> */}

      <div className="h-full w-full flex gap-4 cursor-pointer card border-mix pb-1">
        <div className="flex z-50 bg-white/60 w-full h-full justify-center items-center px-4">
          <FaMapPin size={24} className="text-primary mr-4 animate-bounce" />
          <h1 className="text-primary-500 text-sm font-semibold truncate">
            {!pinToPanTo
              ? "Select POI to track!"
              : handleRenderMainQuestText(pinToPanTo)}
          </h1>
        </div>
      </div>

      {/* <div className="w-[48px] h-[48px] shrink-0 rounded-full border-mix p-1">
        <div className="w-full h-full bg-white rounded-full z-50"></div>
      </div> */}
    </div>
  );
};

export default MainQuest;
