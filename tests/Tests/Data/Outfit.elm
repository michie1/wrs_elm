module Tests.Data.Outfit exposing (..)

import Data.Outfit exposing (Outfit(WTOS), outfitToString)
import Expect exposing (Expectation)
import Test exposing (..)


suite : Test
suite =
    describe "Data Outfit"
        [ test "outfitToString" <|
            \_ ->
                Expect.equal "wtos" (outfitToString WTOS)
        ]
