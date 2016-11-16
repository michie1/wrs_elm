module App.Commands exposing (fetchForRoute)

import App.Msg exposing (Msg)
import App.Routing exposing (Route)

import Task
import Date

fetchForRoute : Route -> Cmd Msg
fetchForRoute route =
    let
        a = Debug.log "fetchForRoute" route
    in
        case route of
            App.Routing.RacesAdd ->
                Cmd.batch
                    [ setRaceAdd
                    , Task.perform 
                        identity 
                        (Task.succeed App.Msg.UpdateMaterialize)
                    ]
            App.Routing.CommentAdd raceId ->
                Cmd.batch
                    [ Task.perform 
                        identity 
                        (Task.succeed App.Msg.UpdateMaterialize)
                    ]

            App.Routing.ResultsAdd raceId ->
                    Cmd.batch 
                        [ Task.perform
                            identity
                            (Task.succeed App.Msg.Autocomplete)
                        ]

            _ ->
                Cmd.none

setRaceAdd : Cmd Msg
setRaceAdd =
    Task.perform 
        (Just >> App.Msg.SetRaceAdd) 
        Date.now


