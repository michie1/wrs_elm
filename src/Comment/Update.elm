module Comment.Update exposing (add, addRiderName, addText, commentsSocket, commentsSocketResponse, addSocketResponse)

import Array
import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import Comment.Model exposing (Comment, Add, initialAdd)
import Rider.Model
import Date
import Time
import App.Helpers
import Task
import App.Routing
import Json.Decode
import Json.Encode
import App.Decoder
import Phoenix.Socket
import Phoenix.Push


add :
    Comment.Model.Add
    -> List Rider.Model.Rider
    -> Phoenix.Socket.Socket App.Msg.Msg
    -> Maybe ( Phoenix.Socket.Socket App.Msg.Msg, Cmd Msg )
add commentAdd riders phxSocket =
    case getRiderByName commentAdd.riderName riders of
        Just rider ->
            Just <| addSocket commentAdd rider.id phxSocket

        Nothing ->
            Nothing



--add : App -> ( App, Cmd Msg )
--add app =
--    let
--        nowTask =
--            Task.perform
--                (Just >> App.Msg.CommentAddWithTime)
--                Time.now
--    in
--        ( app, Cmd.batch [ nowTask ] )


addSocket :
    Comment.Model.Add
    -> Int
    -> Phoenix.Socket.Socket App.Msg.Msg
    -> ( Phoenix.Socket.Socket App.Msg.Msg, Cmd Msg )
addSocket commentAdd riderId phxSocket =
    let
        payload =
            Json.Encode.object
                [ ( "riderId", Json.Encode.int riderId )
                , ( "raceId", Json.Encode.int commentAdd.raceId )
                , ( "text", Json.Encode.string commentAdd.text )
                ]

        phxPush =
            Phoenix.Push.init "createComment" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk CommentAddSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( nextPhxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush phxSocket
    in
        ( nextPhxSocket
        , Cmd.map PhoenixMsg phxCmd
        )


addText : String -> Comment.Model.Add -> Comment.Model.Add
addText text commentAdd =
    { commentAdd
        | text = text
    }


addRiderName : String -> Comment.Model.Add -> Comment.Model.Add
addRiderName name commentAdd =
    { commentAdd | riderName = name }


commentsSocket : App -> ( App, Cmd Msg )
commentsSocket app =
    let
        _ =
            Debug.log "comments" "socket"

        payload =
            Json.Encode.object [ ( "name", Json.Encode.string "hoi" ) ]

        phxPush =
            Phoenix.Push.init "comments" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk CommentsSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( phxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush app.phxSocket
    in
        ( { app | phxSocket = phxSocket }
        , Cmd.map PhoenixMsg phxCmd
        )


commentsSocketResponse : Json.Decode.Value -> App -> ( App, Cmd Msg )
commentsSocketResponse message app =
    let
        resultComments =
            (Json.Decode.decodeValue
                (Json.Decode.field "comments" (Json.Decode.list App.Decoder.commentDecoder))
                message
            )
    in
        case resultComments of
            Ok comments ->
                ( { app | comments = Just comments }
                , Cmd.none
                )

            Err errorMessage ->
                let
                    b =
                        Debug.log "comments socket response" errorMessage
                in
                    ( app
                    , Cmd.none
                    )


addSocketResponse : Json.Decode.Value -> Maybe (Cmd Msg)
addSocketResponse rawResponse =
    case Json.Decode.decodeValue (Json.Decode.field "raceId" Json.Decode.int) rawResponse of
        Ok raceId ->
            Just <| App.Helpers.navigate <| App.Routing.RaceDetails raceId

        Err error ->
            let
                _ =
                    Debug.log "addSocketResponse error" error
            in
                Nothing



-- Helpers


getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)
