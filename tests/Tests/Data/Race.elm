module Tests.Data.Race exposing (..)

import Data.Race exposing (Race, getRace, lastRaces)
import Data.RaceType exposing (RaceType(Criterium))
import Date
import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)


suite : Test
suite =
    describe "Data Race"
        [ test "lastRaces" <|
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
        , test "getRace" <|
            \_ ->
                let
                    key =
                        "key"

                    raceA =
                        Race key "name" (Date.fromTime 0) Criterium
                in
                Expect.equal (getRace key [ raceA ]) (Just raceA)
        ]
