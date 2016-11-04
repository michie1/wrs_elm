module Tests exposing (..)

import Test exposing (..)
import Expect
import String

import App.Update
import App.Model

import Races.Model

import Comments.Update

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
        , test "Comment Add initial text" <|
            \() ->
                let
                    initialApp = fst App.Model.initial
                in
                    Expect.equal initialApp.commentAdd.text "Empty comment"
        , test "Comment Add set text" <|
            \() ->
                let
                    initialApp = fst App.Model.initial
                    newApp = fst (Comments.Update.setText initialApp "Foo")
                in
                    Expect.equal newApp.commentAdd.text "Foo"     
                
        , test "Comment Add set raceId" <|
            \() ->
                let
                    initialApp = fst App.Model.initial
                    newApp = fst (Comments.Update.setRaceId initialApp 1)
                in
                    Expect.equal newApp.commentAdd.raceId 1  
        ]
