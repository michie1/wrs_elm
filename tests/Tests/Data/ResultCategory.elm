module Tests.Data.ResultCategory exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import Data.ResultCategory exposing (ResultCategory(Amateurs, EliteAmateurs), categoryToString, categoryReadable)


suite : Test
suite =
    describe "Data RaceType"
        [ test "categoryToString" <|
            \_ ->
                Expect.equal "amateurs" (categoryToString Amateurs)
        , test "categoryReadable" <|
            \_ ->
                Expect.equal "elite/amateurs" (categoryReadable EliteAmateurs)
        ]
