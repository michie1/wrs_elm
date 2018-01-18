module Tests.Page.Race.Add.Update exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import App.Model
import App.Page
import Page.Race.Add.Update exposing (update)
import Page.Race.Add.Msg as Msg exposing (Msg)
import Page.Race.Add.Model exposing (Model)
import Data.RaceType exposing (RaceType(Classic))
import DatePicker

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
        ]
