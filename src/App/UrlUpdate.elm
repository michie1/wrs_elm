module App.UrlUpdate exposing (urlUpdate, onUrlEnter)

--import App.Msg exposing (Msg(..))

import App.Msg exposing (Msg, Msg(..))
import App.Model exposing (App)
import App.Routing exposing (Route)
import Account.Model
import Comment.Model
import Result.Model
import Race.Model
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


onUrlLeave : App.Routing.Route -> App -> App
onUrlLeave prevRoute prevApp =
    case prevRoute of
        _ ->
            { prevApp | page = App.Model.NoOp }


onUrlEnter : App.Routing.Route -> App -> ( App, Cmd Msg )
onUrlEnter route app =
    case route of
        App.Routing.AccountLogin ->
            case app.account of
                Just account ->
                    ( app, App.Helpers.navigate App.Routing.Account )

                Nothing ->
                    ( { app | page = App.Model.AccountLogin Account.Model.login }
                    , fetchForRoute App.Routing.AccountLogin
                      -- TODO: Move code from fetchForRoute inside this function.
                    )

        App.Routing.AccountLoginName name ->
            case app.account of
                Just account ->
                    ( app, App.Helpers.navigate App.Routing.Account )

                Nothing ->
                    let
                        accountLogin =
                            Account.Model.login

                        nextAccountLogin =
                            { accountLogin | name = name }
                    in
                        ( { app | page = App.Model.AccountLogin nextAccountLogin }
                        , fetchForRoute App.Routing.AccountLogin
                        )

        App.Routing.ResultAdd raceId ->
            case app.account of
                Nothing ->
                    let
                        _ =
                            Debug.log "nothing" "app.account"
                    in
                        ( app, Cmd.none )

                Just account ->
                    case app.riders of
                        Nothing ->
                            let
                                _ =
                                    Debug.log "nothing" "app.riders"
                            in
                                ( app, Cmd.none )

                        Just riders ->
                            let
                                resultAdd =
                                    Result.Model.initialAdd

                                {--
                                name =
                                    case app.account of
                                        Just account ->
                                            case resultExists account.id raceId app.results of
                                                False ->
                                                    account.name

                                                True ->
                                                    ""

                                        Nothing ->
                                            ""
                                --}
                                filteredRiders =
                                    List.filter
                                        (\rider -> not <| resultExists rider.id raceId app.results)
                                        riders

                                items : List Ui.Chooser.Item
                                items =
                                    List.map
                                        (\rider ->
                                            { id = toString rider.id
                                            , label = rider.name
                                            , value = toString rider.id
                                            }
                                        )
                                        filteredRiders

                                accountInFilteredRiders =
                                    List.length
                                        ((List.filter
                                            (\rider ->
                                                rider.id == account.id
                                            )
                                            filteredRiders
                                         )
                                        )
                                        == 1

                                chooser =
                                    case accountInFilteredRiders of
                                        True ->
                                            resultAdd.chooser
                                                |> Ui.Chooser.items items
                                                |> Ui.Chooser.setValue (toString account.id)

                                        False ->
                                            resultAdd.chooser
                                                |> Ui.Chooser.items items

                                resultAddWithRaceId =
                                    { resultAdd
                                        | raceId = raceId
                                        , chooser = chooser
                                    }
                            in
                                ( { app | page = App.Model.ResultAdd resultAddWithRaceId }
                                , fetchForRoute (App.Routing.ResultAdd raceId)
                                )

        App.Routing.CommentAdd raceId ->
            case app.account of
                Just account ->
                    let
                        commentAdd =
                            Comment.Model.initialAdd

                        riderName =
                            account.name

                        commentAddWithRaceId =
                            { commentAdd
                                | raceId = raceId
                                , riderName = riderName
                            }

                        a =
                            Debug.log "urlUpdate CommentAdd" riderName

                        b =
                            Debug.log "urlUpdate CommentAdd" raceId
                    in
                        ( { app | page = App.Model.CommentAdd commentAddWithRaceId }
                        , fetchForRoute (App.Routing.CommentAdd raceId)
                        )

                Nothing ->
                    ( app
                    , Cmd.none
                    )

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

        App.Routing.AccountSignup ->
            case app.account of
                Just account ->
                    ( app, App.Helpers.navigate App.Routing.Account )

                Nothing ->
                    ( { app | page = App.Model.AccountSignup Account.Model.signup }
                    , Cmd.none
                    )

        App.Routing.RaceDetails id ->
            let
                cmd =
                    Cmd.batch []
            in
                ( app, cmd )

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


resultExists : Int -> Int -> List Result.Model.Result -> Bool
resultExists riderId raceId results =
    List.length
        (List.filter
            (\result -> result.riderId == riderId && result.raceId == raceId)
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

        App.Routing.CommentAdd raceId ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "text")
                ]

        App.Routing.AccountLogin ->
            Cmd.batch
                []

        App.Routing.ResultAdd raceId ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "result")
                ]

        App.Routing.Races ->
            Cmd.batch
                []

        _ ->
            Cmd.none
