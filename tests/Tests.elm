module Tests exposing (..)

import Test exposing (..)
import Expect
import String

import App.Update
import App.Model
import App.Msg

import Races.Model

--import Comments.Update
import Comments.Model

import Util

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
                Expect.equal (Util.fromJust (Just 5)) 5
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
        app = App.Model.initial
    in
        test "commentAdd is initially Nothing" <|
            \() ->
                Expect.equal app.commentAdd Nothing

commentAddInitialJust : Test
commentAddInitialJust = 
    let
        initialApp = App.Model.initial
        initialAdd = Comments.Model.initialAdd
        raceId = 1
        commentAdd = { initialAdd | raceId = raceId }
    in
        describe "commentAdd initial Just"
            [ test "text" <|
                \() ->
                    Expect.equal commentAdd.text "Empty comment"
            , test "raceId" <|
                \() ->
                    Expect.equal commentAdd.raceId raceId
            ]

commentAdd : Test
commentAdd =
    let 
        initialApp = App.Model.initial
        initialAdd = Comments.Model.initialAdd
        raceId = 1
        commentAdd = { initialAdd | raceId = raceId }
        app = { initialApp | commentAdd = Just commentAdd }
        numCommentsBefore = List.length app.comments 

        ( newApp, cmd ) = App.Update.update App.Msg.CommentAdd app
    in
        describe "Adding a comment"
        [ test "commentAdd should be Nothing" <|
            \() ->
                Expect.equal newApp.commentAdd Nothing
        , test "Number of comments should be one more" <|
            \() ->
                let
                    numCommentsAfter = List.length newApp.comments
                in
                    Expect.equal numCommentsAfter (numCommentsBefore + 1)
        ]
