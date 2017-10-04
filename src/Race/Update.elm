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

import Json.Decode.Extra


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

category : String -> Race.Model.Category
category string =
    case string of
        "klassieker" ->
            Race.Model.Classic

        "criterium" ->
            Race.Model.Criterium

        "regiocross" ->
            Race.Model.Regiocross


        "other" ->
            Race.Model.Other

        _ ->
            Race.Model.Other

categoryDecoder : String -> Json.Decode.Decoder Race.Model.Category
categoryDecoder string =
    Json.Decode.succeed (category string)

race : Json.Decode.Decoder Race.Model.Race
race =
    Json.Decode.map4 
        Race.Model.Race
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "date" (Json.Decode.maybe Json.Decode.Extra.date))
        (Json.Decode.field "category" 
            (Json.Decode.andThen categoryDecoder Json.Decode.string)
        )

racesDecoder : Json.Decode.Decoder (List Race.Model.Race)
racesDecoder =
    Json.Decode.list race

racesJson : Json.Decode.Value -> App -> ( App, Cmd Msg )
racesJson json app =
    let
        _ = Debug.log "json" json
        nextRacesResult = Debug.log "races" (Json.Decode.decodeValue racesDecoder json)
    in
        case nextRacesResult of
            Ok races ->
                ( { app | races = Just races }
                , Cmd.none
                )
            _ ->
                ( app, Cmd.none )
