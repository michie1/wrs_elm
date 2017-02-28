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
import Phoenix.Socket
import Phoenix.Push
import Json.Encode
import Json.Decode
import App.Decoder
import App.Encoder
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Date


add :
    Race.Model.Add
    -> Phoenix.Socket.Socket App.Msg.Msg
    -> Maybe ( Phoenix.Socket.Socket App.Msg.Msg, Cmd Msg )
add raceAdd phxSocket =
    case String.isEmpty raceAdd.name of
        False ->
            Just <| addSocket raceAdd phxSocket

        True ->
            Nothing


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





racesSocket : App -> ( App, Cmd Msg )
racesSocket app =
    let
        _ =
            Debug.log "races" "socket"

        payload =
            Json.Encode.object [ ( "name", Json.Encode.string "hoi" ) ]

        phxPush =
            Phoenix.Push.init "races" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk RacesSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( phxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush app.phxSocket
    in
        ( { app | phxSocket = phxSocket }
        , Cmd.map PhoenixMsg phxCmd
        )


racesSocketResponse : Json.Decode.Value -> App -> ( App, Cmd Msg )
racesSocketResponse message app =
    let
        resultRaces =
            (Json.Decode.decodeValue
                (Json.Decode.field "races" (Json.Decode.list App.Decoder.raceDecoder))
                message
            )
    in
        case resultRaces of
            Ok races ->
                ( { app | races = Just races }
                , Cmd.none
                )

            Err errorMessage ->
                let
                    b =
                        Debug.log "races socket response" errorMessage
                in
                    ( app
                    , Cmd.none
                    )


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d 00:00:00" date


addSocket : Race.Model.Add -> Phoenix.Socket.Socket App.Msg.Msg -> ( Phoenix.Socket.Socket App.Msg.Msg, Cmd Msg )
addSocket raceAdd phxSocket =
    let
        {--
        dateString =
            case raceAdd.date of
                Just date ->
                    dateFormat date

                Nothing ->
                    ""
        --}
        dateString = 
            dateFormat raceAdd.calendar.value


        payload =
            Json.Encode.object
                [ ( "name", Json.Encode.string raceAdd.name )
                , ( "date", Json.Encode.string dateString )
                , ( "category", App.Encoder.raceCategory raceAdd.category )
                ]

        phxPush =
            Phoenix.Push.init "createRace" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk RaceAddSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( nextPhxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush phxSocket
    in
        ( nextPhxSocket
        , Cmd.map PhoenixMsg phxCmd
        )


addSocketResponse : Json.Decode.Value -> Maybe (Cmd Msg)
addSocketResponse rawResponse =
    case Json.Decode.decodeValue (Json.Decode.field "id" Json.Decode.int) rawResponse of
        Ok id ->
            Just <| App.Helpers.navigate <| App.Routing.RaceDetails id

        Err _ ->
            Nothing
