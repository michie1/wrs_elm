module App.Commands exposing (fetchForRoute)

import App.Msg exposing (Msg)
import App.Routing exposing (Route)

import Task
import Date

fetchForRoute : Route -> Cmd Msg
fetchForRoute route =
    case route of
        App.Routing.RacesAdd ->
            Cmd.batch
                [ setRaceAdd
                , Task.perform 
                    identity 
                    (Task.succeed App.Msg.UpdateMaterialize)
                ]
        _ ->
            Cmd.none

setRaceAdd : Cmd Msg
setRaceAdd =
    Task.perform 
        (Just >> App.Msg.SetRaceAdd) 
        Date.now


