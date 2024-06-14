import { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import {
  Coordinates,
  GetDistanceFromCoordinatesToMeters,
} from "../_utils/coordinateMath";
import { Button } from "./ui/button";
import { Pin } from "../_utils/global";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";

const GuessDistanceModal = ({
  guessedPin,
  setGuessedPin,
  // guessPoiPosition,
  userCoordinates,
  score,
}: {
  guessedPin: Pin
  // guessPoiPosition: Coordinates;
  setGuessedPin: (arg0: Pin | null) => void;
  userCoordinates: Coordinates;
  score: number | null;
}) => {
  const [distanceToPin, setDistancePin] = useState<number>(0);
  const [hint, setHint] = useState<string>("");
  const drawerRef = useRef<HTMLButtonElement>(null); // Ref for the Done button
  const thresholdDistance = 20;

  useEffect(() => {
    if (!guessedPin) return;
    handleDistanceToPin(guessedPin, userCoordinates);
  }, [guessedPin]);

  const handleDistanceToPin = (
    guessedPin: Pin,
    userCoordinates: Coordinates
  ) => {
    const pinCoordinates: Coordinates = {
      longitude: guessedPin.exact_longitude,
      latitude: guessedPin.exact_latitude,
    };

    const distance = GetDistanceFromCoordinatesToMeters(
      userCoordinates,
      pinCoordinates
    );
    setDistancePin(distance);
  };

  const handleSubmitHint = async () => {
    const hintData = {
      poi_id: guessedPin.poi_id,
      content: hint,
    };
    console.log(hintData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posthint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hintData),
        }
      );

      if (response.status === 201) {
        alert(
          "Hint submitted successfully! Now get out there and find more POIS!"
        );
        drawerRef.current?.click(); // Simulate clicking the Done button
      } else {
        console.log(hintData)
        const responseData = (await response.json()) as { message?: string };
        alert(
          `Failed to submit hint: ${responseData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      alert(`Error submitting hint: ${(error as Error).message}`);
    }
  };

  const handleSubmitClick = () => {
    handleSubmitHint().catch(console.error);
  };

  return (
    <div className="fixed bottom-40 flex w-screen justify-center items-center z-50">
      <Drawer>
        <div className="w-1/2 bg-white p-4 rounded-2xl">
          <p className="mb-4">
            You guessed{" "}
            <span className="text-primary font-semibold">
              { distanceToPin > 1000
                ? (distanceToPin / 1000)
                  .toFixed(2) + "km"
                : distanceToPin.toFixed(2) + "m"}{" "}
            </span>
            away from the picture and your score is{" "}
            <span className="text-primary font-semibold">{score}</span>! Good
            job!
          </p>
          <DrawerTrigger asChild>
            <Button className="w-full">Next</Button>
          </DrawerTrigger>
        </div>
        <DrawerContent>
          {distanceToPin < thresholdDistance ? (
            <div className="p-4">
              <p className="my-2">
                {`Nice Guessing! How about leaving a hint for someone else?`} 
                {`(Be sure to be helpful! But don't just give it away!)`}
              </p>
              <Label htmlFor="hint">Your hint: </Label>
              <Input
                id="hint"
                type="text"
                placeholder="Leave a Hint"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="border p-2 mt-2 w-full"
              />
              <div className="flex flex-col gap-4 mt-4 justify-end">
                <Button
                  variant={"link"}
                  ref={drawerRef}
                  onClick={() => {
                    handleSubmitClick();
                    // setGuessPoiPosition(null);
                    setGuessedPin(null);
                  }}
                  className="w-full"
                >
                  Submit Hint
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h2>{`Good effort! Try to get within 20 meters next time!`}</h2>
              <p>{`(You'll be able to leave a hint if you're close enough!)`}</p>
              <Button
                variant={"link"}
                ref={drawerRef}
                onClick={() => {
                  // setGuessPoiPosition(null);
                  setGuessedPin(null);
                }}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default GuessDistanceModal;
