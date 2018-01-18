module Tests.Page.Race.Add.Update exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import App.Model
import App.Page
import Page.Race.Add.Update exposing (update)
import Page.Race.Add.Msg as Msg exposing (Msg)
import Page.Race.Add.Model exposing (Model)
import Data.RaceType exposing (RaceType(Classic, Criterium))
import DatePicker
import Date

suite : Test
suite =
    describe "Update"
        [ test "name" <|
            \_ ->
                let
                    ( datePicker, datePickerFx ) =
                        DatePicker.init
                    before = Model "before" Classic Nothing datePicker
                    ( nextPage, cmd ) =
                       update (Msg.Name "after") before
                in
                    Expect.equal nextPage.name "after"
        , test "raceType" <|
            \_ ->
                let
                    ( datePicker, datePickerFx ) =
                        DatePicker.init
                    before = Model "before" Classic Nothing datePicker
                    ( nextPage, cmd ) =
                       update (Msg.RaceType Criterium) before
                in
                    Expect.equal nextPage.raceType Criterium
        , test "submit no date" <|
            \_ ->
                let
                    ( datePicker, datePickerFx ) =
                        DatePicker.init
                    before = Model "before" Classic Nothing datePicker
                    ( nextPage, cmd ) =
                       update (Msg.Submit) before
                in
                    Expect.equal cmd Cmd.none
        , test "submit with date" <|
            \_ ->
                let
                    ( datePicker, datePickerFx ) =
                        DatePicker.init
                    before = Model "before" Classic (Just (Date.fromTime 0)) datePicker
                    ( nextPage, cmd ) =
                       update (Msg.Submit) before
                    _ = Debug.log "cmd" cmd
                    home = cmd.home
                in
                    Expect.notEqual cmd Cmd.none
        ]
