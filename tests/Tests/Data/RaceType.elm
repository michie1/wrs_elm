module Tests.Data.RaceType exposing (..)

import Data.RaceType exposing (RaceType(..), getPointsByRaceType, raceType, raceTypeReadable, raceTypeToString)
import Expect exposing (Expectation)
import Test exposing (..)


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
                Expect.equal "NK/NCK/NSK" (raceTypeReadable NK)
        , test "getPointsByRaceType" <|
            \_ ->
                Expect.equal 1 (getPointsByRaceType Trainingskoers)
        ]
