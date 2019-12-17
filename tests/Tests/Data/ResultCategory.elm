module Tests.Data.ResultCategory exposing (..)

import Data.ResultCategory exposing (ResultCategory(..), categoryReadable, categoryToString)
import Expect exposing (Expectation)
import Test exposing (..)


suite : Test
suite =
    describe "Data RaceType"
        [ test "categoryToString" <|
            \_ ->
                Expect.equal "amateurs" (categoryToString Amateurs)
        , test "categoryReadable" <|
            \_ ->
                Expect.equal "Elite/amateurs" (categoryReadable EliteAmateurs)
        ]
