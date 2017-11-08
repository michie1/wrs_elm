port module App.UrlUpdate exposing (urlUpdate, onUrlEnter)

import Task
import Dom
import Date
import Ui.Calendar
import Ui.Chooser
import App.Msg exposing (Msg, Msg(..))
import App.Page
import App.Model exposing (App)
import App.Routing exposing (Route)
import Page.Result.Add.Model as ResultAdd
import Page.Race.Add.Model as RaceAdd
import Page.Rider.Add.Model as RiderAdd
import Data.RaceType as RaceType
import Data.RaceResult exposing (RaceResult)

port loadRiders : () -> Cmd msg


port loadRaces : () -> Cmd msg


port loadResults : () -> Cmd msg


onUrlEnter : App.Routing.Route -> App -> ( App, Cmd Msg )
onUrlEnter route app =
    case route of
        App.Routing.ResultAdd raceKey ->
            let
                resultAdd =
                    ResultAdd.initial

                resultAddWithRaceKey =
                    { resultAdd | raceKey = raceKey }
            in
                ( { app | page = App.Page.ResultAdd resultAddWithRaceKey }
                , Task.attempt (always App.Msg.Noop) (Dom.focus "result")
                )

        App.Routing.RaceAdd ->
            let
                raceAdd =
                    RaceAdd.Model "" RaceType.Classic (Ui.Calendar.init ())
            in
                ( { app | page = App.Page.RaceAdd raceAdd }
                , Task.attempt (always App.Msg.Noop) (Dom.focus "name")
                )

        App.Routing.RiderAdd ->
            let
                add =
                    RiderAdd.Model "" Nothing
            in
                ( { app | page = App.Page.RiderAdd add }
                , Task.attempt (always App.Msg.Noop) (Dom.focus "name")
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
