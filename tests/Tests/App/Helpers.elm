module Tests.App.Helpers exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import Date
import App.Helpers exposing (numMonth, leadingZero)


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
