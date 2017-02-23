module App.UrlUpdate exposing (urlUpdate)

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
            let
                resultAdd =
                    Result.Model.initialAdd

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

                resultAddWithRaceId =
                    { resultAdd
                        | raceId = raceId
                        , riderName = name
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
                    Race.Model.Add "" Nothing Race.Model.Classic
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
                    Cmd.batch
                        [ Task.perform
                            identity
                            (Task.succeed App.Msg.RacesSocket)
                        , Task.perform
                            identity
                            (Task.succeed App.Msg.ResultsSocket)
                        ]
            in
                ( app, cmd )

        _ ->
            ( app, Cmd.none )


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
                , Task.perform
                    (Just >> App.Msg.SetRaceAdd)
                    Date.now
                ]

        App.Routing.CommentAdd raceId ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "text")
                ]

        App.Routing.AccountLogin ->
            Cmd.batch
                [ Task.perform
                    identity
                    (Task.succeed App.Msg.Connect)
                  -- TODO: Only if list is Nothing
                ]

        App.Routing.ResultAdd raceId ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "result")
                ]

        App.Routing.Races ->
            Cmd.batch
                [ Task.perform
                    identity
                    (Task.succeed App.Msg.RacesSocket)
                ]

        _ ->
            Cmd.none
