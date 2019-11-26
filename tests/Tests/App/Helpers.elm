module Tests.App.Helpers exposing (..)

import App.Helpers exposing (leadingZero, numMonth)
import Date
import Expect exposing (Expectation)
import Test exposing (..)


suite : Test
suite =
    describe "App Helpers"
        [ test "numMonth" <|
            \_ ->
                Expect.equal (numMonth Date.Jan) 1
        , test "leadingZero" <|
            \_ ->
                Expect.equal "09" (leadingZero 9)
        ]
