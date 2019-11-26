module Tests.Data.RaceResult exposing (..)

import Data.Outfit exposing (Outfit(WTOS))
import Data.RaceResult exposing (RaceResult, getPointsByResult, getPointsByResults, resultExists)
import Data.ResultCategory exposing (ResultCategory(Elite))
import Expect exposing (Expectation)
import Test exposing (..)


suite : Test
suite =
    describe "Data RaceResult"
        [ test "resultExists" <|
            \_ ->
                let
                    result =
                        RaceResult "key" "riderKey" "raceKey" "result" Elite WTOS
                in
                Expect.equal True (resultExists result [ result ])
        , test "resultExists not exists" <|
            \_ ->
                let
                    result =
                        RaceResult "key" "riderKey" "raceKey" "result" Elite WTOS
                in
                Expect.equal False (resultExists result [])
        ]
