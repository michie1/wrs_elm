module Page.Race.Add.Update exposing (update)

import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Json.Encode
import DatePicker
import App.Model exposing (App)
import App.Page
import App.OutsideInfo exposing (sendInfoOutside)
import Page.Race.Add.Msg as Msg exposing (Msg)
import Data.RaceType exposing (raceTypeToString)


settings : DatePicker.Settings
settings =
    DatePicker.defaultSettings


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case app.page of
        App.Page.RaceAdd page ->
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
                                ( app, sendInfoOutside <| App.OutsideInfo.RaceAdd payload )

                        Nothing ->
                            ( app, Cmd.none )

                Msg.Name name ->
                    let
                        nextPage =
                            App.Page.RaceAdd
                                { page | name = name }
                    in
                        ( { app | page = nextPage }, Cmd.none )

                Msg.RaceType raceType ->
                    let
                        nextPage =
                            App.Page.RaceAdd
                                { page | raceType = raceType }
                    in
                        ( { app | page = nextPage }, Cmd.none )

                Msg.ToDatePicker subMsg ->
                    let
                        ( newDatePicker, datePickerFx, dateEvent ) =
                            DatePicker.update settings subMsg page.datePicker

                        newDate =
                            case dateEvent of
                                DatePicker.Changed newDate ->
                                    newDate

                                _ ->
                                    page.date

                        nextPage =
                            App.Page.RaceAdd
                                { page | date = newDate, datePicker = newDatePicker }
                    in
                        ( { app | page = nextPage }
                        , Cmd.none
                        )

        _ ->
            ( app, Cmd.none )


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d 00:00:00" date
