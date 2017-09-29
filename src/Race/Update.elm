module Race.Update exposing (..)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Helpers
import Race.Model
import Date
import Date.Extra
import Task
import App.Helpers
import App.Routing
import Json.Encode
import Json.Decode
import App.Decoder
import App.Encoder
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Date


addPage2 : App.Msg.Msg -> App.Model.Page -> App.Model.Page
addPage2 msg page =
    case page of
        App.Model.RaceAdd raceAdd ->
            case msg of
                RaceName name ->
                    App.Model.RaceAdd <| addName name raceAdd

                RaceAddCategory category ->
                    App.Model.RaceAdd <| addCategory category raceAdd

                _ ->
                    page

        _ ->
            page


addPage : App.Msg.Msg -> Maybe Race.Model.Add -> Maybe Race.Model.Add
addPage msg maybeRaceAdd =
    case maybeRaceAdd of
        Just raceAdd ->
            case msg of
                RaceName name ->
                    Just <| addName name raceAdd

                RaceAddCategory category ->
                    Just <| addCategory category raceAdd

                _ ->
                    Nothing

        Nothing ->
            Nothing


addName : String -> Race.Model.Add -> Race.Model.Add
addName newName raceAdd =
    { raceAdd | name = newName }


addCategory : Race.Model.Category -> Race.Model.Add -> Race.Model.Add
addCategory category raceAdd =
    { raceAdd | category = category }





dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d 00:00:00" date
