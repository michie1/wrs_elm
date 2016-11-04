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
        , comment
        ]

comment : Test
comment = 
    let
        initialApp = fst App.Model.initial
        appText = fst (Comments.Update.setText initialApp "Foo")
        appRaceId = fst (Comments.Update.setRaceId appText 1)
        appCommentAdd = fst (Comments.Update.add appRaceId)
        comment = App.Update.fromJust (List.head (appCommentAdd.comments))
    in
        describe "Comment test"
            [ test "add initial text" <|
                \() ->
                    Expect.equal initialApp.commentAdd.text "Empty comment"
            , test "add test text" <|
                \() ->
                    Expect.equal appText.commentAdd.text "Foo"     
            , test "add set raceId" <|
                \() ->
                    Expect.equal appRaceId.commentAdd.raceId 1  
            , test "Add length comments list" <|
                \() ->
                    Expect.equal (List.length appCommentAdd.comments) 2
            , test "Add text" <|
                \() ->
                    Expect.equal comment.text "Foo"
            ]

