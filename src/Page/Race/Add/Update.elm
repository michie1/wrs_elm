port module Page.Race.Add.Update exposing (addPage, addSubmit)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Page
import App.Helpers
import Page.Race.Add.Model as RaceAdd
import Date
import Date.Extra
import Task
import App.Helpers
import App.Routing
import Json.Encode
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Date
import Json.Decode
import Json.Decode.Extra
import Data.RaceType as RaceType exposing (RaceType, raceType, raceTypeToString)
import Data.Race exposing (Race)

port addRace : Json.Encode.Value -> Cmd msg


addPage : App.Msg.Msg -> App.Page.Page -> App.Page.Page
addPage msg page =
    case page of
        App.Page.RaceAdd raceAdd ->
            case msg of
                RaceName name ->
                    App.Page.RaceAdd <| addName name raceAdd

                RaceAddRaceType raceType ->
                    App.Page.RaceAdd <| addRaceType raceType raceAdd

                _ ->
                    page

        _ ->
            page


addName : String -> RaceAdd.Model -> RaceAdd.Model
addName newName raceAdd =
    { raceAdd | name = newName }


addRaceType : RaceType -> RaceAdd.Model -> RaceAdd.Model
addRaceType raceType raceAdd =
    { raceAdd | raceType = raceType }


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d 00:00:00" date


addSubmit : RaceAdd.Model -> App.Model.App -> ( App, Cmd Msg )
addSubmit raceAdd app =
    let
        dateString =
            dateFormat raceAdd.calendar.value

        payload =
            Json.Encode.object
                [ ( "name", Json.Encode.string raceAdd.name )
                , ( "date", Json.Encode.string dateString )
                , ( "category", Json.Encode.string <| raceTypeToString raceAdd.raceType )
                ]
    in
        ( app, addRace payload )
