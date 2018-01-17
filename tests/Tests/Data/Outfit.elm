module Tests.Data.Outfit exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import Data.Outfit exposing (Outfit(WTOS), outfitToString)


suite : Test
suite =
    describe "Data Outfit"
        [ test "outfitToString" <|
            \_ ->
                Expect.equal "wtos" (outfitToString WTOS)
        ]
