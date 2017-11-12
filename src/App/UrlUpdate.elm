module App.UrlUpdate exposing (urlUpdate)

import Task
import Dom
import Ui.Calendar
import App.Msg as Msg exposing (Msg)
import App.Page
import App.Model exposing (App)
import App.Routing
import App.OutsideInfo exposing (sendInfoOutside)
import Page.Result.Add.Model as ResultAdd
import Page.Race.Add.Model as RaceAdd
import Page.Rider.Add.Model as RiderAdd
import Data.RaceType as RaceType


routeToPage : App.Routing.Route -> Maybe App.Page.Page
routeToPage route =
    let
        routePages =
            [ ( App.Routing.Riders, App.Page.Riders )
            , ( App.Routing.Races, App.Page.Races )
            ]

        maybeRoutePage =
            List.filter (\f -> Tuple.first f == route) routePages
                |> List.head
    in
        case maybeRoutePage of
            Just ( _, p ) ->
                Just p

            Nothing ->
                Nothing


urlUpdate : App.Routing.Route -> App -> ( App, Cmd Msg )
urlUpdate route app =
    case route of
        App.Routing.ResultAdd raceKey ->
            let
                resultAdd =
                    ResultAdd.initial

                resultAddWithRaceKey =
                    { resultAdd | raceKey = raceKey }
            in
                ( { app | page = App.Page.ResultAdd resultAddWithRaceKey }
                , Task.attempt (always Msg.Noop) (Dom.focus "result")
                )

        App.Routing.RaceAdd ->
            let
                raceAdd =
                    RaceAdd.Model "" RaceType.Classic (Ui.Calendar.init ())
            in
                ( { app | page = App.Page.RaceAdd raceAdd }
                , Task.attempt (always Msg.Noop) (Dom.focus "name")
                )

        App.Routing.RiderAdd ->
            let
                add =
                    RiderAdd.Model "" Nothing
            in
                ( { app | page = App.Page.RiderAdd add }
                , Task.attempt (always Msg.Noop) (Dom.focus "name")
                )

        App.Routing.RiderDetails key ->
            ( { app | page = App.Page.RiderDetails key }
            , Cmd.none
            )

        App.Routing.RaceDetails key ->
            ( { app | page = App.Page.RaceDetails key }
            , Cmd.none
            )

        _ ->
            case routeToPage route of
                Just page ->
                    ( { app | page = page }, Cmd.none )

                Nothing ->
                    ( app, Cmd.none )

