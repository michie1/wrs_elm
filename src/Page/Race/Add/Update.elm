module Page.Race.Add.Update exposing (update)

import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Json.Encode
import DatePicker
import App.OutsideInfo exposing (sendInfoOutside)
import Page.Race.Add.Msg as Msg exposing (Msg)
import Page.Race.Add.Model exposing (Model)
import Data.RaceType exposing (raceTypeToString)


settings : DatePicker.Settings
settings =
    DatePicker.defaultSettings


update : Msg -> Model -> ( Model, Cmd Msg )
update msg page =
    case msg of
        Msg.Submit ->
            case page.date of
                Just date ->
                    let
                        payload =
                            Json.Encode.object
                                [ ( "name", Json.Encode.string page.name )
                                , ( "date", Json.Encode.string <| dateFormat date )
                                , ( "category", Json.Encode.string <| raceTypeToString page.raceType )
                                ]
                    in
                        ( page, sendInfoOutside <| App.OutsideInfo.RaceAdd payload )

                Nothing ->
                    ( page, Cmd.none )

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
                ( newDatePicker, _, dateEvent ) =
                    DatePicker.update settings subMsg page.datePicker

                newDate =
                    case dateEvent of
                        DatePicker.Changed date ->
                            date

                        _ ->
                            page.date

                nextPage =
                    { page | date = newDate, datePicker = newDatePicker }
            in
                ( nextPage
                , Cmd.none
                )


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d 00:00:00" date
