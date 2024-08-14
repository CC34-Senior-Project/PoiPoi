import { MdLeaderboard } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { ButtonIconCircle } from "./ui/MenuIconCircle";
import { FaMapLocationDot } from "react-icons/fa6";
import Poidex from "./Poidex";
// import SubmitGuessButton from "./SubmitGuessButton";
import { Coordinates } from "../_utils/coordinateMath";

import { Pin } from "../_utils/global";
import Link from "next/link";
import { useState } from "react";

interface GameControlsProps {
  pins: Pin[];
  trackingPin: Pin | null;
  userCoordinates: Coordinates | null;
  distanceToTrackingPin: number | null;
}

const GameControls = ({
  pins,
}: // trackingPin,             //For future use by other game controls
// userCoordinates,
// distanceToTrackingPin,
GameControlsProps): React.JSX.Element => {
  const [showPoidex, setShowPoidex] = useState<boolean>(false);

  return (
    <div className="flex justify-between min-w-[360px] max-w-full">
      <Link href={"/map"}>
        <ButtonIconCircle
          text="Map"
          variant={!showPoidex ? "active" : "default"}
        >
          <FaMapLocationDot size={24} />
        </ButtonIconCircle>
      </Link>

      <Poidex
        pins={pins}
        setShowPoidex={setShowPoidex}
        showPoidex={showPoidex}
      />

      <Link href="/leaderboard">
        <ButtonIconCircle text="Leaderboard">
          <MdLeaderboard size={24} />
        </ButtonIconCircle>
      </Link>

      <Link href={"/login"}>
        <ButtonIconCircle text="Account">
          <MdAccountCircle size={24} />
        </ButtonIconCircle>
      </Link>
    </div>
  );
};

export default GameControls;
