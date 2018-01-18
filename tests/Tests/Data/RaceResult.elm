module Tests.Data.RaceResult exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import Data.RaceResult exposing (RaceResult, resultExists, getPointsByResult, getPointsByResults)
import Data.ResultCategory exposing (ResultCategory(Elite))
import Data.Outfit exposing (Outfit(WTOS))


suite : Test
suite =
    describe "Data RaceResult"
        [ test "resultExists" <|
            \_ ->
                let
                    result = RaceResult "key" "riderKey" "raceKey" "result" Elite WTOS
                in
                    Expect.equal True (resultExists result [ result ])
        , test "resultExists not exists" <|
            \_ ->
                let
                    result = RaceResult "key" "riderKey" "raceKey" "result" Elite WTOS
                in
                    Expect.equal False (resultExists result [])
        ]
