module Tests.Data.Rider exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import Date
import Data.Race exposing (Race, lastRaces, getRace)
import Data.RaceType exposing (RaceType(Criterium))
import Data.RaceResult exposing (RaceResult, getPointsByResults)
import Data.Rider exposing (getPointsByRiderId)
import Data.ResultCategory exposing (ResultCategory(..))
import Data.Outfit exposing (Outfit(..))


suite : Test
suite =
    describe "Data Rider"
        [ test "getRiderById" <|
            \_ ->
                let
                    race1 =
                        Race "akey" "name" (Date.fromTime 0) Criterium

                    race2 =
                        Race "akey" "name" (Date.fromTime 1) Criterium

                    race3 =
                        Race "akey" "name" (Date.fromTime 2) Criterium

                    race4 =
                        Race "akey" "name" (Date.fromTime 3) Criterium

                    race5 =
                        Race "akey" "name" (Date.fromTime 4) Criterium

                    race6 =
                        Race "akey" "name" (Date.fromTime 5) Criterium

                    race7 =
                        Race "akey" "name" (Date.fromTime 6) Criterium

                    last5 =
                        lastRaces [ race1, race2, race3, race4, race5, race6, race7 ]
                in
                    Expect.equal last5 [ race7, race6, race5, race4, race3 ]
        , test "getPointsByRiderId" <|
            \_ ->
                let
                    riderKey = "riderKey"
                    results = 
                        [ RaceResult "resultKey" riderKey "raceKey" "5" Elite WTOS
                        , RaceResult "resultKey2" riderKey "raceKey2" "4" Elite WASP
                        , RaceResult "resultKey3" riderKey "raceKey3" "4" Elite WTOS
                        ]
                    races = 
                        [ Race "raceKey" "name" (Date.fromTime 6) Criterium
                        , Race "raceKey2" "name" (Date.fromTime 7) Data.RaceType.Classic
                        , Race "raceKey3" "name" (Date.fromTime 8) Data.RaceType.Classic
                        ]
                in
                    Expect.equal 7 (getPointsByRiderId riderKey results races)
        ]
