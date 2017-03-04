module Result.Update exposing (add, addCategory, addStrava, addResult, addSocketResponse, resultsSocket, resultsSocketResponse)

import App.Model exposing (App)
import Result.Model exposing (Add)
import Rider.Model
import App.Msg exposing (Msg(..))
import Result.Helpers exposing (..)
import App.Helpers
import App.Routing
import Phoenix.Socket
import Phoenix.Push
import Json.Encode
import Json.Decode
import App.Encoder
import App.Decoder
import Set


add : Result.Model.Add -> List Rider.Model.Rider -> List Result.Model.Result -> Phoenix.Socket.Socket App.Msg.Msg -> Maybe ( Phoenix.Socket.Socket App.Msg.Msg, Cmd Msg )
add resultAdd riders results phxSocket =
    -- case App.Helpers.getRiderByName resultAdd.riderName riders of
    --case App.Helpers.getRiderByResultId "1" riders of
    --    Just rider ->
    case resultAdd.chooser.selected |> Set.toList |> List.head of
        Just riderIdString ->
            case String.toInt riderIdString of
                Err val ->
                    Nothing

                Ok riderId -> 
                   let
                       payload =
                            Json.Encode.object
                                [ ( "riderId", Json.Encode.int riderId )
                                , ( "raceId", Json.Encode.int resultAdd.raceId )
                                , ( "result", Json.Encode.string resultAdd.result )
                                , ( "category", App.Encoder.resultCategory resultAdd.category )
                                , ( "strava", Json.Encode.string resultAdd.strava )
                                ]

                       phxPush =
                            Phoenix.Push.init "createResult" "room:lobby"
                                |> Phoenix.Push.withPayload payload
                                |> Phoenix.Push.onOk ResultAddSocketResponse
                                |> Phoenix.Push.onError HandleSendError

                       ( nextPhxSocket, phxCmd ) =
                            Phoenix.Socket.push phxPush phxSocket
                   in
                        Just <|
                        ( nextPhxSocket
                        , Cmd.map PhoenixMsg phxCmd
                        )

        Nothing ->
            Nothing
     
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


addSocketResponse : Json.Decode.Value -> Maybe (Cmd Msg)
addSocketResponse rawResponse =
    case Json.Decode.decodeValue (Json.Decode.field "raceId" Json.Decode.int) rawResponse of
        Ok id ->
            let
                _ =
                    Debug.log "raceId" id
            in
                Just <| App.Helpers.navigate <| App.Routing.RaceDetails id

        Err error ->
            let
                _ =
                    Debug.log "addSocketResponse Err" error
            in
                Nothing


resultsSocket : App -> ( App, Cmd Msg )
resultsSocket app =
    let
        _ =
            Debug.log "results" "socket"

        payload =
            Json.Encode.object [ ( "name", Json.Encode.string "hoi" ) ]

        phxPush =
            Phoenix.Push.init "results" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk ResultsSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( phxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush app.phxSocket
    in
        ( { app | phxSocket = phxSocket }
        , Cmd.map PhoenixMsg phxCmd
        )


resultsSocketResponse : Json.Decode.Value -> App -> ( App, Cmd Msg )
resultsSocketResponse message app =
    let
        resultResults =
            (Json.Decode.decodeValue
                (Json.Decode.field "results" (Json.Decode.list App.Decoder.resultDecoder))
                message
            )
    in
        case resultResults of
            Ok results ->
                ( { app | results = results }
                , Cmd.none
                )

            Err errorMessage ->
                let
                    b =
                        Debug.log "result socket response" errorMessage
                in
                    ( app
                    , Cmd.none
                    )
