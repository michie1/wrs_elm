module App.Commands exposing (fetchForRoute)

import App.Msg exposing (Msg)
import App.Routing exposing (Route)
import Task
import Dom
import Date


fetchForRoute : Route -> Cmd Msg
fetchForRoute route =
    case route of
        App.Routing.RacesAdd ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "name")
                , Task.perform
                    identity
                    (Task.succeed App.Msg.UpdateMaterialize)
                , Task.perform
                    (Just >> App.Msg.SetRaceAdd)
                    Date.now
                ]

        App.Routing.CommentAdd raceId ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "text")
                , Task.perform
                    identity
                    (Task.succeed App.Msg.UpdateMaterialize)
                  --, Dom.focus "name" |> Task.attempt FocusResult
                  --, Task.perform identity (Task.succeed (Dom.focus "name"))
                ]

        App.Routing.AccountLogin ->
            Cmd.batch
                [ Task.perform
                    identity
                    (Task.succeed App.Msg.Connect)
                  -- TODO: Only if list is Nothing
                ]

        App.Routing.ResultsAdd raceId ->
            Cmd.batch
                [ Task.attempt (always App.Msg.Noop) (Dom.focus "result")
                , Task.perform
                    identity
                    (Task.succeed App.Msg.UpdateMaterialize)
                ]

        App.Routing.Riders ->
            Cmd.batch
                [ Task.perform
                    identity
                    (Task.succeed App.Msg.Connect)
                ]

        _ ->
            Cmd.none
