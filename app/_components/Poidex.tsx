import PoidexModal from "./PoidexModal";
import { Pin } from "../_utils/global";
import { BsCollectionFill } from "react-icons/bs";
import { ButtonIconCircle } from "./ui/MenuIconCircle";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PoidexProps {
  pins: Pin[];
  setShowPoidex: (arg0: boolean) => void;
  showPoidex: boolean;
}

const Poidex = ({
  pins,
  setShowPoidex,
  showPoidex,
}: PoidexProps): React.JSX.Element => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab === "collection") {
      setShowPoidex(true);
    }
  }, []);

  return (
    <>
      <ButtonIconCircle
        text="Collection"
        variant={showPoidex ? "secondary" : "default"}
        onClick={(): void => void setShowPoidex(true)}
      >
        <BsCollectionFill size={24} />
      </ButtonIconCircle>

      {showPoidex ? (
        <PoidexModal pins={pins} setShowPoidex={setShowPoidex} />
      ) : null}
    </>
  );
};

export default Poidex;
