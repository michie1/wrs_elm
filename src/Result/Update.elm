module Result.Update exposing (add, riderName)

import App.Model exposing (App)
import Result.Model exposing (Add)
import Rider.Model
import App.Msg exposing (Msg(..))
import Navigation

import Result.Helpers exposing (..)


add : App -> ( Maybe Result.Model.Result, Cmd Msg )
add app =
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
                nextResultAdd = { resultAdd | riderName = name }
            in
                ( { app | resultAdd = Just nextResultAdd } 
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )
