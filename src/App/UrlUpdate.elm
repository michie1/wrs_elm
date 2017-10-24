port module App.UrlUpdate exposing (urlUpdate, onUrlEnter)

import App.Msg exposing (Msg, Msg(..))
import App.Model exposing (App)
import App.Routing exposing (Route)
import Result.Model
import Race.Model
import Rider.Model
import Task
import Dom
import Date
import App.Routing
import Ui.Calendar
import Ui.Chooser


port loadRiders : () -> Cmd msg


port loadRaces : () -> Cmd msg


port loadResults : () -> Cmd msg


onUrlEnter : App.Routing.Route -> App -> ( App, Cmd Msg )
onUrlEnter route app =
    case route of
        App.Routing.ResultAdd raceKey ->
            let
                resultAdd =
                    Result.Model.initialAdd

                resultAddWithRaceKey =
                    { resultAdd | raceKey = raceKey }
            in
                ( { app | page = App.Model.ResultAdd resultAddWithRaceKey }
                , Cmd.none
                )

        App.Routing.RaceAdd ->
            let
                raceAdd =
                    Race.Model.Add "" Race.Model.Classic (Ui.Calendar.init ())
            in
                ( { app | page = App.Model.RaceAdd raceAdd }
                , Cmd.none
                )

        App.Routing.RiderAdd ->
            let
                add =
                    Rider.Model.Add "" Nothing
            in
                ( { app | page = App.Model.RiderAdd add }
                , Cmd.none
                )


        App.Routing.RiderDetails key ->
            ( { app | page = App.Model.RiderDetails key }
            , Cmd.none
            )

        App.Routing.RaceDetails key ->
            ( { app | page = App.Model.RaceDetails key }
            , Cmd.none
            )

        _ ->
            let
                page =
                    Maybe.withDefault app.page (routeToPage route)
            in
                ( { app | page = page }, Cmd.none )


routeToPage : App.Routing.Route -> Maybe App.Model.Page
routeToPage route =
    let
        routePages =
            [ ( App.Routing.Riders, App.Model.Riders )
            , ( App.Routing.Races, App.Model.Races )
            , ( App.Routing.Home, App.Model.Races )
            ]

        maybeRoutePage =
            List.filter (\f -> Tuple.first f == route) routePages
                |> List.head
    in
        case maybeRoutePage of
            Just ( r, p ) ->
                Just p

            Nothing ->
                Nothing


load : App -> List (Cmd Msg)
load app =
    [ if app.races == Nothing then
        loadRaces ()
      else
        Cmd.none
    , if app.riders == Nothing then
        loadRiders ()
      else
        Cmd.none
    , if app.results == Nothing then
        loadResults ()
      else
        Cmd.none
    ]


replace : String -> String -> String -> String
replace from to str =
    String.split from str
        |> String.join to


urlUpdate : App.Routing.Route -> App -> ( App, Cmd Msg )
urlUpdate route app =
    let
        ( nextApp, routeCmd ) =
            onUrlEnter route app

        cmd =
            Cmd.batch (routeCmd :: load app)
    in
        ( nextApp, cmd )


resultExists : String -> String -> List Result.Model.Result -> Bool
resultExists riderKey raceKey results =
    List.length
        (List.filter
            (\result -> result.riderKey == riderKey && result.raceKey == raceKey)
            results
        )
        == 1


fetchForRoute : Route -> Cmd Msg
fetchForRoute route =
    case route of
        App.Routing.RaceAdd ->
            Task.attempt (always App.Msg.Noop) (Dom.focus "name")

        App.Routing.RiderAdd ->
            Task.attempt (always App.Msg.Noop) (Dom.focus "name")

        App.Routing.ResultAdd raceKey ->
            Task.attempt (always App.Msg.Noop) (Dom.focus "result")

        _ ->
            Cmd.none
