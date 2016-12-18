module Result.Update exposing (add, addCategory, riderName, addStrava, addResult)

import App.Model exposing (App)
import Result.Model exposing (Add)
import Rider.Model
import App.Msg exposing (Msg(..))
import Navigation
import Result.Helpers exposing (..)


add : App -> ( App, Cmd Msg )
add app =
    let
        ( maybeResult, cmd ) =
            maybeAdd app
    in
        case maybeResult of
            Just result ->
                ( { app | results = result :: app.results }
                , cmd
                )

            Nothing ->
                ( app, Cmd.none )


maybeAdd : App -> ( Maybe Result.Model.Result, Cmd Msg )
maybeAdd app =
    case app.riders of
        Just riders ->
            case app.resultAdd of
                Just resultAdd ->
                    case (getRiderByName resultAdd.riderName riders) of
                        Just rider ->
                            let
                                maybeStrava =
                                    case resultAdd.strava of
                                        "" ->
                                            Nothing

                                        link ->
                                            Just link

                                result =
                                    Result.Model.Result
                                        (calcResultId app.results)
                                        rider.id
                                        resultAdd.raceId
                                        resultAdd.result
                                        resultAdd.category
                                        maybeStrava
                            in
                                if resultExists result app.results then
                                    ( Nothing, Debug.log "result already exists" Cmd.none )
                                else
                                    ( Just result
                                    , Navigation.newUrl ("#races/" ++ toString (Debug.log "raceId" result.raceId))
                                    )

                        Nothing ->
                            ( Nothing, Cmd.none )

                Nothing ->
                    ( Nothing, Cmd.none )

        Nothing ->
            ( Nothing, Cmd.none )


riderName : App -> String -> ( App, Cmd Msg )
riderName app name =
    case app.resultAdd of
        Just resultAdd ->
            let
                nextResultAdd =
                    { resultAdd | riderName = name }
            in
                ( { app | resultAdd = Just nextResultAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addCategory : Result.Model.ResultCategory -> App -> ( App, Cmd Msg )
addCategory category app =
    case app.resultAdd of
        Just resultAdd ->
            let
                nextResultAdd =
                    { resultAdd | category = category }
            in
                ( { app | resultAdd = Just nextResultAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addStrava : String -> App -> ( App, Cmd Msg )
addStrava link app =
    case app.resultAdd of
        Just resultAdd ->
            let
                nextResultAdd =
                    { resultAdd | strava = link }
            in
                ( { app | resultAdd = Just nextResultAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addResult : String -> App -> ( App, Cmd Msg )
addResult value app =
    case app.resultAdd of
        Just resultAdd ->
            let
                resultAddWithResult =
                    { resultAdd | result = value }
            in
                ( { app | resultAdd = Just resultAddWithResult }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )
