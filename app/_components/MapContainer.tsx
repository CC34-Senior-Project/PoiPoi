"use client";

import { useEffect, useState, useContext } from "react";
import { LngLatBoundsLike, MapProvider, Map } from "react-map-gl/maplibre";
import { Pin, levelAndXp, trackingPinID } from "../_utils/global";
import MarkerContainer from "./MarkerContainer";
import MapControls from "./MapControls";
import { AuthContext } from "./useContext/AuthContext";
import { getAuthService } from "@/config/firebaseconfig";
import GameControls from "./GameControls";
import {
  Coordinates,
  GetDistanceFromCoordinatesToMeters,
} from "../_utils/coordinateMath";
import FilterButton from "./FilterButton";
import GuessPolyline from "./ui/guessPolyline";
import PopoverCard from "./PopoverCard";
import GuessDistanceModal from "./GuessDistanceModal";
import PoiPhotoToggle from "./PoiPhotoToggle";
import ImportantPinContextProvider, {
  ImportantPinContext,
} from "./useContext/ImportantPinContext";
import MainQuest from "./MainQuest";
import LevelContainer from "./LevelContainer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

//Map Settings
const mapMaxBounds: LngLatBoundsLike = [
  139.47995, //West
  35.52205, //South
  139.93502, //East
  35.84602, //North
];
const mapMaxZoom = 20;
const mapMinZoom = 10;
const mapMaxPitch = 0;

function MapInner() {
  // USE STATE
  const [poiData, setPoiData] = useState<Pin[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedPoiId, setSelectedPoiId] = useState<number | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(
    null
  );
  const [closestNotCompletedPin, setClosestNotCompletedPin] =
    useState<Pin | null>(null);
  const [distanceToTrackingPin, setDistanceToTrackingPin] = useState<
    number | null
  >(null);

  const [score, setScore] = useState<number | null>(null);
  const [userCoordinatesAtMomentOfGuess, setUserGuessCoord] =
    useState<Coordinates | null>(null);

  const [checkLevel, setCheckLevel] = useState<boolean>(false);
  const [levelAndXp, setLevelAndXp] = useState<levelAndXp>({
    level: 0,
    totalXp: 0,
    xpToNextLevel: 0,
  });

  // Default camera map when user opens the app
  const longitude: number = 139.72953967417234;
  const latitude: number = 35.66060121205606;
  const [viewPort, setViewPort] = useState({
    longitude: longitude,
    latitude: latitude,
    zoom: 14,
  });

  const user = useContext(AuthContext);
  const importantPinContext = useContext(ImportantPinContext);

  // USE EFFECT
  useEffect(() => {
    user ? void handleFetchPoiByUid() : void handleFetchPoiByAnonymous();
    void handleFetchFilters();
  }, [user]);

  useEffect(() => {
    if (importantPinContext?.trackingPin) {
      const trackingPoiId: trackingPinID = {
        poi_id: importantPinContext.trackingPin.poi_id,
      };
      localStorage.setItem("trackingPinID", JSON.stringify(trackingPoiId));
    }
  }, [importantPinContext?.trackingPin]);

  useEffect(() => {
    if (!importantPinContext) return;
    if (poiData.length === 0) return;

    getTrackingPinFromLocalStorage();
  }, [poiData]);

  useEffect(() => {
    if (!closestNotCompletedPin || !userCoordinates) return;
    handleDistanceToClosestPin(userCoordinates, closestNotCompletedPin);
  }, [closestNotCompletedPin, userCoordinates]);

  useEffect(() => {
    if (!importantPinContext?.guessedPin) {
      setUserGuessCoord(null);
    }
    if (!userCoordinates) return;
    const currentUserCoordinates: Coordinates = userCoordinates;
    setUserGuessCoord(currentUserCoordinates);
  }, [importantPinContext?.guessedPin]);

  useEffect(() => {
    if (!importantPinContext?.trackingPin) return;
    if (
      !selectedFilters.every((tag) =>
        importantPinContext.trackingPin?.tags.includes(tag)
      )
    ) {
      importantPinContext.setTrackingPin(null);
      localStorage.setItem(
        "trackingPinID",
        JSON.stringify({ poi_id: -1 } as trackingPinID)
      );
    }
  }, [selectedFilters]);

  //on load, or refresh
  useEffect(() => {
    const savedLevelAndXp = localStorage.getItem("levelAndXp");
    if (savedLevelAndXp) {
      setLevelAndXp(JSON.parse(savedLevelAndXp) as levelAndXp);
    } else {
      void handleLevelAndXp();
    }
  }, []);

  //on guess
  useEffect(() => {
    void handleLevelAndXp();
  }, [checkLevel]);

  const getTrackingPinFromLocalStorage = () => {
    if (!importantPinContext) return console.error("No important pin context");
    if (!poiData || poiData.length === 0) return console.error("no poi data");

    const savedPoiId = localStorage.getItem("trackingPinID");
    if (!savedPoiId) return;

    const { poi_id } = JSON.parse(savedPoiId) as trackingPinID;
    const savedTrackingPoi =
      poiData.find((pin) => pin.poi_id === poi_id) || null;
    importantPinContext.setTrackingPin(savedTrackingPoi);
  };

  // HANDLER FUNCTION
  const handleFetchPoiByUid = async () => {
    try {
      const auth = await getAuthService();
      if (!auth.currentUser) throw "No current user";
      const uid: string = auth.currentUser.uid;

      const response = await fetch(`${BASE_URL}/api/poi/status`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: uid }),
      });
      const data: Pin[] = (await response.json()) as Pin[];
      setPoiData(data);
    } catch (error) {
      console.error(error);
      setPoiData([]);
    }
  };

  const handleFetchPoiByAnonymous = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/poi/`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Pin[] = (await response.json()) as Pin[];
      setPoiData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchFilters = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/tag`);
      const data: string[] = (await response.json()) as string[];
      setFilters(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDistanceToClosestPin = (
    userCoordinates: Coordinates,
    pin: Pin
  ) => {
    const pinCoordinates: Coordinates = {
      longitude: pin.search_longitude,
      latitude: pin.search_latitude,
    };
    const distance = GetDistanceFromCoordinatesToMeters(
      userCoordinates,
      pinCoordinates
    );
    setDistanceToTrackingPin(distance);
  };

  /**
   * Sets the user's coordinates
   * @param position
   */
  const handleSetUserCoordinates = (position: GeolocationCoordinates) => {
    const userCoord: Coordinates = {
      longitude: position.longitude,
      latitude: position.latitude,
    };
    setUserCoordinates(userCoord);
  };

  /**
   * Sets closestNotCompletedPin to the closes pin BY POSITION
   * Accounts for the toggled filters
   * @param position
   */
  const handleSetClosestNotCompletedPin = (
    position: GeolocationCoordinates
  ) => {
    const userCoordinates: Coordinates = {
      longitude: position.longitude,
      latitude: position.latitude,
    };

    let shortestDistance: number = Number.MAX_SAFE_INTEGER;
    let closestPin: Pin | null = null;

    const pinsAfterFiltering = poiData.filter((pin) => {
      return pin.is_completed
        ? false
        : selectedFilters.length === 0
        ? true
        : selectedFilters.every((tag) => pin.tags.includes(tag));
    });

    for (const pin of pinsAfterFiltering) {
      const pinCoordinates: Coordinates = {
        longitude: pin.search_longitude,
        latitude: pin.search_latitude,
      };

      const distance: number = GetDistanceFromCoordinatesToMeters(
        userCoordinates,
        pinCoordinates
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestPin = pin;
      }
    }
    setClosestNotCompletedPin(closestPin);
  };

  const handleLevelAndXp = async () => {
    try {
      const auth = await getAuthService();
      if (!auth.currentUser) throw "No current user";
      const uid = auth.currentUser.uid;

      const response = await fetch(`${BASE_URL}/api/level/`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebase_uuid: uid }),
      });
      const data = (await response.json()) as levelAndXp;
      setLevelAndXp(data);

      // Save to local storage if use reloads the page then it will use the localstorage data
      localStorage.setItem("levelAndXp", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  // RETURN
  return (
    <div className="relative overflow-hidden inset-0 bg-mapBg">
      {/* GAME UI */}
      <div className="absolute top-0 left-0 z-50 w-screen pt-4 gap-4 flex flex-col">
        {/* HEADER CONTROLLER */}
        <div id="headerMenu" className="fixed top-20 flex flex-col gap-4 w-full">
          <FilterButton
            filters={filters}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
          {/* <HintButton poi_id={selectedPoiId} /> */}
        </div>

        {/* ISLAND CONTROLLER */}
        <PoiPhotoToggle
          userCoordinates={userCoordinates}
          closestNotCompletedPin={closestNotCompletedPin}
          setShowPopup={setShowPopup}
          setSelectedPoiId={setSelectedPoiId}
          showPopup={showPopup}
        />

        {/* FOOTER CONTROLLER */}
        <div
          id="footerMenu"
          className="fixed bottom-0 left-0 w-full flex gap-2 h-16 bg-white rounded-t-3xl justify-center items-end"
        >
          <GameControls
            pins={poiData}
            trackingPin={closestNotCompletedPin}
            userCoordinates={userCoordinates}
            distanceToTrackingPin={distanceToTrackingPin}
          />
        </div>
      </div>

      {/* MAP CANVAS */}
      <Map
        id="gameMap"
        maxPitch={mapMaxPitch}
        minZoom={mapMinZoom}
        maxZoom={mapMaxZoom}
        maxBounds={mapMaxBounds}
        {...viewPort}
        onMove={(evt) => setViewPort(evt.viewState)}
        style={{ width: "100svw", height: "100svh" }}
        reuseMaps
        dragRotate={false}
        mapStyle={`https://api.protomaps.com/styles/v2/light.json?key=${process.env.NEXT_PUBLIC_PROTOMAPS_API_KEY}`}
      >
        {/* FOR V1 DEVELOPMENT */}
        {poiData
          .filter((pin) =>
            selectedFilters.length === 0
              ? true
              : selectedFilters.every((tag) => pin.tags.includes(tag))
          )
          .map((pin: Pin): JSX.Element => {
            return (
              <MarkerContainer
                key={pin.poi_id}
                pin={pin}
                setShowPopup={setShowPopup}
                setSelectedPoiId={setSelectedPoiId}
              />
            );
          })}

        {/* Popup */}
        {showPopup && selectedPoiId && (
          <PopoverCard
            setCheckLevel={setCheckLevel}
            poiData={poiData}
            selectedPoiId={selectedPoiId}
            setShowPopup={setShowPopup}
            userCoordinates={userCoordinates}
            setScore={setScore}
          />
        )}

        {/* GUESS MODEL */}
        {userCoordinatesAtMomentOfGuess &&
          importantPinContext &&
          importantPinContext.guessedPin && (
            <>
              <GuessPolyline
                userLocation={userCoordinatesAtMomentOfGuess}
                guessPoiLocation={
                  {
                    longitude: importantPinContext.guessedPin.exact_longitude,
                    latitude: importantPinContext.guessedPin.exact_latitude,
                  } as Coordinates
                }
              />
              <GuessDistanceModal
                guessedPin={importantPinContext.guessedPin}
                setGuessedPin={importantPinContext.setGuessedPin}
                userCoordinates={userCoordinatesAtMomentOfGuess}
                score={score}
              />
            </>
          )}
        <MainQuest closestNotCompletedPin={closestNotCompletedPin} />
        <MapControls
          handleUserCoordinates={handleSetUserCoordinates}
          handleSetClosestNotCompletedPin={handleSetClosestNotCompletedPin}
        />
      </Map>

      <LevelContainer levelAndXp={levelAndXp} />
    </div>
  );
}

const MapContainer = () => (
  <ImportantPinContextProvider>
    <MapProvider>
      <MapInner />
    </MapProvider>
  </ImportantPinContextProvider>
);

export default MapContainer;
