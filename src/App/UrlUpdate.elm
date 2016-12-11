module App.UrlUpdate exposing (urlUpdate)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Routing
import App.Commands
import Account.Model
import Comment.Model
import Result.Model
import Race.Model
import Navigation


onUrlLeave : App.Routing.Route -> App -> App
onUrlLeave prevRoute prevApp =
    case prevRoute of
        App.Routing.CommentAdd raceId ->
            { prevApp | commentAdd = Nothing }

        App.Routing.AccountSignup ->
            { prevApp | accountSignup = Nothing }

        App.Routing.AccountLogin ->
            { prevApp | accountLogin = Nothing }

        App.Routing.RacesAdd ->
            { prevApp | raceAdd = Nothing }

        _ ->
            prevApp


onUrlEnter : App.Routing.Route -> App -> ( App, Cmd Msg )
onUrlEnter route app =
    case route of
        App.Routing.AccountLogin ->
            case app.account of
                Just account ->
                    ( app, Navigation.newUrl "#account" )

                Nothing ->
                    ( { app | accountLogin = Just Account.Model.login }
                    , App.Commands.fetchForRoute App.Routing.AccountLogin -- TODO: Move code from fetchForRoute inside this function.
                    )

        App.Routing.AccountLoginName name ->
            case app.account of
                Just account ->
                    ( app, Navigation.newUrl "#account" )

                Nothing ->
                    let
                        accountLogin =
                            Account.Model.login

                        nextAccountLogin =
                            { accountLogin | name = name }
                    in
                        ( { app | accountLogin = Just nextAccountLogin }
                        , App.Commands.fetchForRoute App.Routing.AccountLogin
                        )

        App.Routing.ResultsAdd raceId ->
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
                ( { app | resultAdd = Just resultAddWithRaceId }
                , App.Commands.fetchForRoute (App.Routing.ResultsAdd raceId)
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
                        ( { app | commentAdd = Just commentAddWithRaceId }
                        , App.Commands.fetchForRoute (App.Routing.CommentAdd raceId)
                        )

                Nothing ->
                    ( app
                    , Cmd.none
                    )

        App.Routing.RacesAdd ->
            let
                a =
                    Debug.log "urlUpdate" "RacesAdd"

                raceAdd =
                    Race.Model.Add "" Nothing Race.Model.Classic
            in
                ( { app | raceAdd = Just raceAdd }
                , App.Commands.fetchForRoute App.Routing.RacesAdd
                )

        App.Routing.AccountSignup ->
            case app.account of
                Just account ->
                    ( app, Navigation.newUrl "#account" )

                Nothing ->
                    ( { app | accountSignup = Just Account.Model.signup }
                    , Cmd.none
                    )

        App.Routing.Riders ->
            case app.riders of
                Just riders ->
                    ( app, Cmd.none )

                Nothing ->
                    ( app, App.Commands.fetchForRoute App.Routing.Riders )

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
