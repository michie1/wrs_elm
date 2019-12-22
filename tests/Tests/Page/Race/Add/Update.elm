module Tests.Page.Race.Add.Update exposing (suite)

import App.OutsideInfo exposing (sendInfoOutside)
import Data.RaceType exposing (RaceType(..))
import Date
import DatePicker
import Expect
import Json.Encode
import Page.Race.Add.Model exposing (Model)
import Page.Race.Add.Msg as Msg
import Page.Race.Add.Update exposing (update)
import Test exposing (Test, describe, test)
import Time exposing (Month(..))


suite : Test
suite =
    describe "Update"
        [ test "name" <|
            \_ ->
                let
                    ( datePicker, _ ) =
                        DatePicker.init

                    before =
                        Model "before" Classic Nothing datePicker

                    ( nextPage, _ ) =
                        update (Msg.Name "after") before (Time.millisToPosix 0)
                in
                Expect.equal nextPage.name "after"
        , test "raceType" <|
            \_ ->
                let
                    ( datePicker, _ ) =
                        DatePicker.init

                    before =
                        Model "before" Classic Nothing datePicker

                    ( nextPage, _ ) =
                        update (Msg.RaceType Criterium) before (Time.millisToPosix 0)
                in
                Expect.equal nextPage.raceType Criterium
        , test "submit no date" <|
            \_ ->
                let
                    ( datePicker, _ ) =
                        DatePicker.init

                    before =
                        Model "before" Classic Nothing datePicker

                    ( _, cmd ) =
                        update Msg.Submit before (Time.millisToPosix 0)

                    payload =
                        Json.Encode.object
                            [ ( "name", Json.Encode.string "before" )
                            , ( "date", Json.Encode.string "1970-01-01" )
                            , ( "category", Json.Encode.string "classic" )
                            ]
                in
                Expect.equal cmd (sendInfoOutside <| App.OutsideInfo.RaceAdd payload)
        , test "submit with date" <|
            \_ ->
                let
                    ( datePicker, _ ) =
                        DatePicker.init

                    before =
                        Model "before" Classic (Just (Date.fromCalendarDate 1970 Jan 1)) datePicker

                    ( _, cmd ) =
                        update Msg.Submit before (Time.millisToPosix 0)

                    payload =
                        Json.Encode.object
                            [ ( "name", Json.Encode.string "before" )
                            , ( "date", Json.Encode.string "1970-01-01" )
                            , ( "category", Json.Encode.string "classic" )
                            ]
                in
                Expect.equal cmd (sendInfoOutside <| App.OutsideInfo.RaceAdd payload)
        ]
