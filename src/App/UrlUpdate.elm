module App.UrlUpdate exposing (urlUpdate)

--urlUpdate : Result String App.Routing.Route -> App -> ( App, Cmd Msg )

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Routing
import App.Commands
import Account.Model
import Comments.Model
import Results.Model
import Races.Model


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
            ( { app | accountLogin = Just Account.Model.login }
            , App.Commands.fetchForRoute App.Routing.AccountLogin
            )

        App.Routing.AccountLoginName name ->
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
            --(Results.Update.setResultAddRace app raceId)
            let
                resultAdd =
                    Results.Model.initialAdd

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
                  --, Cmd.none
                , App.Commands.fetchForRoute (App.Routing.ResultsAdd raceId)
                )

        App.Routing.CommentAdd raceId ->
            --Comments.Update.setRaceId app raceId
            case app.account of
                Just account ->
                    let
                        commentAdd =
                            Comments.Model.initialAdd

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
                          --, Cmd.none
                        , App.Commands.fetchForRoute (App.Routing.CommentAdd raceId)
                        )

                Nothing ->
                    ( app
                    , Cmd.none
                    )

        App.Routing.RacesAdd ->
            --( { app | raceAdd = Just raceAdd }
            let
                a =
                    Debug.log "urlUpdate" "RacesAdd"
                    
                raceAdd = 
                    Races.Model.Add "" Nothing Races.Model.Classic
            in
                ( { app | raceAdd = Just raceAdd }
                , App.Commands.fetchForRoute App.Routing.RacesAdd
                )

        App.Routing.AccountSignup ->
            ( { app | accountSignup = Just Account.Model.signup }
            , Cmd.none
            )

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


resultExists : Int -> Int -> List Results.Model.Result -> Bool
resultExists riderId raceId results =
    List.length
        (List.filter
            (\result -> result.riderId == riderId && result.raceId == raceId)
            results
        )
        == 1
