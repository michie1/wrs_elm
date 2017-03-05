module Rider.Update exposing (..)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import Json.Decode
import Json.Encode
import App.Decoder
import Phoenix.Socket
import Phoenix.Push
import App.Routing
import App.UrlUpdate

ridersSocket : App -> ( App, Cmd Msg )
ridersSocket app =
    let
        _ =
            Debug.log "riders" "socket"

        payload =
            Json.Encode.object [ ( "name", Json.Encode.string "hoi" ) ]

        phxPush =
            Phoenix.Push.init "riders" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk RidersSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( phxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush app.phxSocket
    in
        ( { app | phxSocket = phxSocket }
        , Cmd.map PhoenixMsg phxCmd
        )


ridersSocketResponse : Json.Decode.Value -> App -> ( App, Cmd Msg )
ridersSocketResponse message app =
    let
        resultResults =
            (Json.Decode.decodeValue
                (Json.Decode.field "riders" (Json.Decode.list App.Decoder.riderDecoder))
                message
            )
    in
        case resultResults of
            Ok riders ->
                case app.page of
                    App.Model.NoOp ->
                        case app.route of
                            App.Routing.ResultAdd raceId ->
                                App.UrlUpdate.onUrlEnter (App.Routing.ResultAdd raceId) { app | riders = Just riders }

                            _ ->
                                ( { app | riders = Just riders }
                                , Cmd.none
                                )
    
                    _ ->
                        ( { app | riders = Just riders }
                        , Cmd.none
                        )

            Err errorMessage ->
                let
                    b =
                        Debug.log "riders socket response" errorMessage
                in
                    ( app
                    , Cmd.none
                    )
