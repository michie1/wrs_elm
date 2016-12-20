module Tests exposing (..)

import Test exposing (..)
import Expect
import String

import App.Update
import App.Model
import App.Msg
import App.Helpers

import Race.Model

--import Comments.Update
import Comment.Model

all : Test
all =
    describe "A Test Suite"
        [ test "Addition" <|
            \() ->
                Expect.equal (3 + 7) 10
        , test "String.left" <|
            \() ->
                Expect.equal "a" (String.left 1 "abcdefg")
        , test "calcRaceId with empty list" <|
            \() ->
                Expect.equal (App.Helpers.calcRaceId []) 1
        , test "calcRaceId with one race in list" <|
            \() ->
                Expect.equal (App.Helpers.calcRaceId [Race.Model.Race 1 "first race" "2016-01-31" Nothing]) 2
        , comment
        ]

comment : Test
comment = 
    let
        bla = 1
        --appNothing = fst App.Model.initial
        --commentAdd = Comments.Model.initialAdd
        --raceId = 1
        --commentAddWithRaceId = { commentAdd | raceId = raceId }
    in
        describe "Comment "
            [ test "hoi" <|
                \() ->
                    Expect.equal True True
            , commentAddInitialNothing
            , commentAddInitialJust
            , commentAdd
            ]

commentAddInitialNothing : Test
commentAddInitialNothing =
    let 
        app = Tuple.first App.Model.initial
    in
        test "commentAdd is initially Nothing" <|
            \() ->
                Expect.equal app.commentAdd Nothing

commentAddInitialJust : Test
commentAddInitialJust = 
    let
        initialApp = App.Model.initial
        initialAdd = Comment.Model.initialAdd
        raceId = 1
        commentAdd = { initialAdd | raceId = raceId }
    in
        describe "commentAdd initial Just"
            [ test "text" <|
                \() ->
                    Expect.equal commentAdd.text ""
            , test "raceId" <|
                \() ->
                    Expect.equal commentAdd.raceId raceId
            ]

commentAdd : Test
commentAdd =
    let 
        initialApp = Tuple.first App.Model.initial
        initialAdd = Comment.Model.initialAdd
        raceId = 1
        commentAdd = { initialAdd | raceId = raceId }
        app = { initialApp | commentAdd = Just commentAdd }
        numCommentsBefore = List.length app.comments 

        ( newApp, cmd ) = App.Update.update App.Msg.CommentAdd app
    in
        describe "Adding a comment"
        [ test "commentAdd Nothing" <|
            \() ->
                Expect.equal initialApp.commentAdd Nothing
        ]
