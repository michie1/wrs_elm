module Tests.Data.Licence exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import Data.Licence exposing (Licence(Elite, Amateurs), licence, licenceToString)


suite : Test
suite =
    describe "Data Licence"
        [ test "licenceToString" <|
            \_ ->
                Expect.equal "elite" (licenceToString Elite)
        , test "licence" <|
            \_ ->
                Expect.equal Amateurs (licence "amateurs")
        ]
