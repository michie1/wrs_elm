module Race.Update exposing (..)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import Navigation
import App.Helpers
import Race.Model
import Date
import Date.Extra
import Task


add : App -> ( App, Cmd Msg )
add app =
    case app.raceAdd of
        Just raceAdd ->
            case raceAdd.name /= "" of
                True ->
                    let
                        --dateString =
                        --    Maybe.withDefault "" raceAdd.dateString
                        newRace =
                            Race.Model.Race
                                (App.Helpers.calcRaceId app.races)
                                raceAdd.name
                                -- dateString
                                raceAdd.dateString
                                raceAdd.category
                    in
                        ( { app
                            | races =
                                (newRace :: app.races)
                          }
                        , Navigation.newUrl ("#races/" ++ (toString newRace.id))
                        )

                False ->
                    ( app, Cmd.none )

        Nothing ->
            ( app, Cmd.none )


addName : String -> App -> ( App, Cmd Msg )
addName newName app =
    case app.raceAdd of
        Just raceAdd ->
            let
                newRaceAdd =
                    { raceAdd | name = newName }
            in
                ( { app
                    | raceAdd = Just newRaceAdd
                  }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addCategory : Race.Model.Category -> App -> ( App, Cmd Msg )
addCategory category app =
    case app.raceAdd of
        Just raceAdd ->
            let
                nextRaceAdd =
                    { raceAdd | category = category }
            in
                ( { app | raceAdd = Just nextRaceAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addDate : String -> App -> ( App, Cmd Msg )
addDate newDate app =
    case app.raceAdd of
        Just raceAdd ->
            let
                newRaceAdd =
                    --{ raceAdd | dateString = Just newDate }
                    { raceAdd | dateString = newDate }
            in
                ( { app
                    | raceAdd = Just newRaceAdd
                  }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addSet : Maybe Date.Date -> App -> ( App, Cmd Msg )
addSet maybeNow app =
    case app.raceAdd of
        Just currentRaceAdd ->
            let
                dateFormatted =
                    case maybeNow of
                        Just now ->
                            App.Helpers.formatDate now

                        Nothing ->
                            ""

                raceAdd =
                    { currentRaceAdd
                      --| dateString = Just dateFormatted
                        | dateString = dateFormatted
                    }
            in
                ( { app | raceAdd = Just raceAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addYesterday : App -> ( App, Cmd Msg )
addYesterday app =
    let
        yesterdayTask =
            Task.perform
                (Just >> App.Msg.RaceAddYesterdayWithDate)
                Date.now
    in
        ( app, Cmd.batch [ yesterdayTask ] )


addYesterdayWithDate : Maybe Date.Date -> App -> ( App, Cmd Msg )
addYesterdayWithDate maybeDate app =
    case app.raceAdd of
        Just raceAdd ->
            let
                dateFormatted =
                    case maybeDate of
                        Just date ->
                            App.Helpers.formatDate (Date.Extra.add Date.Extra.Day (-1) date)

                        Nothing ->
                            ""

                newRaceAdd =
                    --{ raceAdd | dateString = Just dateFormatted }
                    { raceAdd | dateString = dateFormatted }
            in
                ( { app | raceAdd = Just newRaceAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addToday : App -> ( App, Cmd Msg )
addToday app =
    let
        todayTask =
            Task.perform
                (Just >> App.Msg.RaceAddTodayWithDate)
                Date.now
    in
        ( app, Cmd.batch [ todayTask ] )


addTodayWithDate : Maybe Date.Date -> App -> ( App, Cmd Msg )
addTodayWithDate maybeDate app =
    case app.raceAdd of
        Just raceAdd ->
            let
                dateFormatted =
                    case maybeDate of
                        Just date ->
                            App.Helpers.formatDate date

                        Nothing ->
                            ""

                newRaceAdd =
                    --{ raceAdd | dateString = Just dateFormatted }
                    { raceAdd | dateString = dateFormatted }
            in
                ( { app | raceAdd = Just newRaceAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )
