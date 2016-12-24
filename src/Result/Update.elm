module Result.Update exposing (add, addCategory, riderName, addStrava, addResult)

import App.Model exposing (App)
import Result.Model exposing (Add)
import Rider.Model
import App.Msg exposing (Msg(..))
import Result.Helpers exposing (..)
import App.Helpers
import App.Routing


add : Result.Model.Add -> List Rider.Model.Rider -> List Result.Model.Result -> Maybe ( Result.Model.Result, Cmd Msg )
add resultAdd riders results =
    case getRiderByName resultAdd.riderName riders of
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
                        (calcResultId results)
                        rider.id
                        resultAdd.raceId
                        resultAdd.result
                        resultAdd.category
                        maybeStrava
            in
                case resultExists result results of
                    True ->
                        Nothing
                    False ->
                        Just 
                            ( result
                            , App.Helpers.navigate <| App.Routing.RaceDetails result.raceId
                            )

        Nothing ->
            Nothing


riderName : String -> Result.Model.Add -> Result.Model.Add
riderName name resultAdd =
    { resultAdd | riderName = name }


addCategory :
    Result.Model.ResultCategory
    -> Result.Model.Add
    -> Result.Model.Add
addCategory category resultAdd =
    { resultAdd | category = category }


addStrava : String -> Result.Model.Add -> Result.Model.Add
addStrava link resultAdd =
    { resultAdd | strava = link }


addResult : String -> Result.Model.Add -> Result.Model.Add
addResult value resultAdd =
    { resultAdd | result = value }
