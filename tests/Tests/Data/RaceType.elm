module Tests.Data.RaceType exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import Data.RaceType exposing (RaceType(Criterium, NK, Trainingskoers), raceType, raceTypeToString, raceTypeReadable, getPointsByRaceType)


suite : Test
suite =
    describe "Data RaceType"
        [ test "raceType" <|
            \_ ->
                Expect.equal Criterium (raceType "criterium")
        , test "raceTypeToString" <|
            \_ ->
                Expect.equal "criterium" (raceTypeToString Criterium)
        , test "raceTypeReadable" <|
            \_ ->
                Expect.equal "Nederlands kampioenschap" (raceTypeReadable NK)
        , test "getPointsByRaceType" <|
            \_ ->
                Expect.equal 1 (getPointsByRaceType Trainingskoers)
        ]
