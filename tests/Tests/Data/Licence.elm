module Tests.Data.Licence exposing (..)

import Data.Licence exposing (Licence(Amateurs, Elite), licence, licenceToString)
import Expect exposing (Expectation)
import Test exposing (..)


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
