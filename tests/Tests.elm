module Tests exposing (..)

import Test exposing (..)
import Expect
import String
import Date
import App.Update
import App.Model
import App.Msg
import App.Helpers
import Race.Model
import Result.Model
import Result.Update
import Result.Helpers
import Rider.Model


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
                Expect.equal (App.Helpers.calcRaceId [ Race.Model.Race 1 "first race" "2016-01-31" Nothing ]) 2
        , comment
        , result
        , helpers
        ]


result : Test
result =
    describe "Result" <|
        [ test "addStrava" <|
            \() ->
                let
                    old =
                        Result.Model.Add 1 "" "" Result.Model.Unknown "old"

                    new =
                        Result.Update.addStrava "new" old

                    expected =
                        Result.Model.Add 1 "" "" Result.Model.Unknown "new"
                in
                    Expect.equal new expected
        , test "riderName" <|
            \() ->
                let
                    old =
                        Result.Model.Add 1 "old" "" Result.Model.Unknown "old"

                    new =
                        Result.Update.riderName "new" old

                    expected =
                        Result.Model.Add 1 "new" "" Result.Model.Unknown "old"
                in
                    Expect.equal new expected
        , test "addCategory" <|
            \() ->
                let
                    old =
                        Result.Model.Add 1 "" "" Result.Model.Unknown ""

                    new =
                        Result.Update.addCategory Result.Model.Amateurs old

                    expected =
                        Result.Model.Add 1 "" "" Result.Model.Amateurs ""
                in
                    Expect.equal new expected
        , resultHelpers
        ]


resultHelpers : Test
resultHelpers =
    describe "Result Helpers" <|
        [ test "getRiderByName" <|
            \() ->
                let
                    name =
                        "c"

                    a =
                        Rider.Model.Rider 1 "a" Nothing

                    b =
                        Rider.Model.Rider 1 "b" Nothing

                    c =
                        Rider.Model.Rider 1 "c" Nothing

                    riders =
                        [ a, b, c ]

                    expected =
                        Just c
                in
                    Expect.equal
                        (Result.Helpers.getRiderByName name riders)
                        expected
        ]


comment : Test
comment =
    let
        bla =
            1

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
        app =
            Tuple.first App.Model.initial
    in
        test "commentAdd is initially Nothing" <|
            \() ->
                Expect.equal app.commentAdd Nothing


commentAddInitialJust : Test
commentAddInitialJust =
    let
        initialApp =
            App.Model.initial

        initialAdd =
            Comment.Model.initialAdd

        raceId =
            1

        commentAdd =
            { initialAdd | raceId = raceId }
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
        initialApp =
            Tuple.first App.Model.initial

        initialAdd =
            Comment.Model.initialAdd

        raceId =
            1

        commentAdd =
            { initialAdd | raceId = raceId }

        app =
            { initialApp | commentAdd = Just commentAdd }

        numCommentsBefore =
            List.length app.comments

        ( newApp, cmd ) =
            App.Update.update App.Msg.CommentAdd app
    in
        describe "Adding a comment"
            [ test "commentAdd Nothing" <|
                \() ->
                    Expect.equal initialApp.commentAdd Nothing
            ]


helpers : Test
helpers =
    describe "App Helpers" <|
        [ test "True" <|
            \() ->
                Expect.equal True True
        , test "leadingZero 1" <|
            \() ->
                Expect.equal
                    (App.Helpers.leadingZero 1)
                    "01"
        , test "leadingZero 10" <|
            \() ->
                Expect.equal
                    (App.Helpers.leadingZero 10)
                    "10"
        , test "numMonth Jan" <|
            \() ->
                Expect.equal
                    (App.Helpers.numMonth Date.Jan)
                    1
        ]
