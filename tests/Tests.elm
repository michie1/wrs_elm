module Tests exposing (..)

import Test exposing (..)
import Expect
import String

import App.Update

import Races.Model

all : Test
all =
    describe "A Test Suite"
        [ test "Addition" <|
            \() ->
                Expect.equal (3 + 7) 10
        , test "String.left" <|
            \() ->
                Expect.equal "a" (String.left 1 "abcdefg")
        , test "fromJust just" <|
            \() ->
                Expect.equal (App.Update.fromJust (Just 5)) 5
        , test "calcRaceId with empty list" <|
            \() ->
                Expect.equal (App.Update.calcRaceId []) 1
        , test "calcRaceId with one race in list" <|
            \() ->
                Expect.equal (App.Update.calcRaceId [Races.Model.Race 1 "first race"]) 2
        ]
