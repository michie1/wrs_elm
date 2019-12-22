module Page.Race.Add.Update exposing (update)

import App.OutsideInfo exposing (sendInfoOutside)
import Data.RaceType exposing (raceTypeToString)
import Date exposing (toIsoString)
import DatePicker
import Json.Encode
import Page.Race.Add.Model exposing (Model)
import Page.Race.Add.Msg as Msg exposing (Msg)
import Time


settings : DatePicker.Settings
settings =
    DatePicker.defaultSettings


update : Msg -> Model -> Time.Posix -> ( Model, Cmd Msg )
update msg page now =
    case msg of
        Msg.Submit ->
            let
                raceDate =
                    Maybe.withDefault (Date.fromPosix Time.utc now) page.date

                payload =
                    Json.Encode.object
                        [ ( "name", Json.Encode.string page.name )
                        , ( "date", Json.Encode.string <| toIsoString raceDate )
                        , ( "category", Json.Encode.string <| raceTypeToString page.raceType )
                        ]
            in
            ( page, sendInfoOutside <| App.OutsideInfo.RaceAdd payload )

        Msg.Name name ->
            let
                nextPage =
                    { page | name = name }
            in
            ( nextPage, Cmd.none )

        Msg.RaceType raceType ->
            let
                nextPage =
                    { page | raceType = raceType }
            in
            ( nextPage, Cmd.none )

        Msg.ToDatePicker subMsg ->
            let
                ( newDatePicker, dateEvent ) =
                    DatePicker.update settings subMsg page.datePicker

                newDate =
                    case dateEvent of
                        DatePicker.Picked date ->
                            Just date

                        _ ->
                            page.date

                nextPage =
                    { page | date = newDate, datePicker = newDatePicker }
            in
            ( nextPage
            , Cmd.none
            )
