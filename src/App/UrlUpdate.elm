port module App.UrlUpdate exposing (urlUpdate, onUrlEnter)

--import App.Msg exposing (Msg(..))

import App.Msg exposing (Msg, Msg(..))
import App.Model exposing (App)
import App.Routing exposing (Route)
import Result.Model
import Race.Model
import Rider.Model
import Task
import Dom
import Date
import App.Helpers
import App.Routing
import Ui.Calendar
import Ui.Chooser
import Http
import Json.Decode
import Json.Decode.Pipeline
import Json.Encode


port loadRiders : () -> Cmd msg


port loadRaces : () -> Cmd msg


port loadResults : () -> Cmd msg


onUrlLeave : App.Routing.Route -> App -> App
onUrlLeave prevRoute prevApp =
    case prevRoute of
        _ ->
            { prevApp | page = App.Model.NoOp }


onUrlEnter : App.Routing.Route -> App -> ( App, Cmd Msg )
onUrlEnter route app =
    case route of
        App.Routing.ResultAdd raceKey ->
            let
                cmd =
                    Cmd.batch
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

                resultAdd =
                    Result.Model.initialAdd

                resultAddWithRaceKey =
                      { resultAdd | raceKey = raceKey }
            in
                ( { app | page = App.Model.ResultAdd resultAddWithRaceKey }, cmd )


        App.Routing.RaceAdd ->
            let
                a =
                    Debug.log "urlUpdate" "RacesAdd"

                raceAdd =
                    Race.Model.Add "" Race.Model.Classic (Ui.Calendar.init ())
            in
                ( { app | page = App.Model.RaceAdd raceAdd }
                , fetchForRoute App.Routing.RaceAdd
                )

        App.Routing.RiderAdd ->
            let
                add =
                    Rider.Model.Add "" Nothing
            in
                ( { app | page = App.Model.RiderAdd add }
                , fetchForRoute App.Routing.RiderAdd
                )

        App.Routing.RaceDetails id ->
            let
                -- TODO: Fetch everyting on site enter
                cmd =
                    case ( app.races, app.riders ) of
                        ( Nothing, Nothing ) ->
                            Cmd.batch [ loadRaces (), loadRiders () ]

                        ( Nothing, _ ) ->
                            loadRaces ()

                        ( _, Nothing ) ->
                            loadRiders ()

                        _ ->
                            Cmd.none
            in
                ( app, cmd )

        App.Routing.RiderDetails id ->
            let
                cmd =
                    Cmd.batch
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
            in
                ( app, cmd )

        App.Routing.Riders ->
            case app.riders of
                Nothing ->
                    ( app, fetchForRoute App.Routing.Riders )

                _ ->
                    ( app, Cmd.none )

        App.Routing.Races ->
            case app.races of
                Nothing ->
                    ( app, fetchForRoute App.Routing.Races )

                _ ->
                    ( app, Cmd.none )

        _ ->
            ( app, Cmd.none )


replace : String -> String -> String -> String
replace from to str =
    String.split from str
        |> String.join to


urlUpdate : App.Routing.Route -> App -> ( App, Cmd Msg )
urlUpdate route app =
    let
        prevRoute =
            app.route

        leaveApp =
            onUrlLeave prevRoute app

        routeApp =
            { leaveApp | route = route }
    in
        onUrlEnter route routeApp


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
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "name")
                ]

        App.Routing.RiderAdd ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "name")
                ]

        App.Routing.ResultAdd raceKey ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "result")
                ]

        App.Routing.Races ->
            loadRaces ()

        App.Routing.Riders ->
            loadRiders ()

        App.Routing.RaceDetails id ->
            loadResults ()

        App.Routing.RiderDetails id ->
            loadResults ()

        _ ->
            Cmd.none
