module Comment.Update exposing (add, addWithTime, addRiderName, addText, commentsSocket, commentsSocketResponse)

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


add : App -> ( App, Cmd Msg )
add app =
    let
        nowTask =
            Task.perform
                (Just >> App.Msg.CommentAddWithTime)
                Time.now
    in
        ( app, Cmd.batch [ nowTask ] )


addText : String -> Comment.Model.Add -> Comment.Model.Add
addText text commentAdd =
    { commentAdd
        | text = text
    }


addWithTime : Maybe Time.Time -> App -> ( App, Cmd Msg )
addWithTime maybeTime app =
    case maybeTime of
        Just time ->
            let
                datetime =
                    (App.Helpers.formatDate (Date.fromTime time))
                        ++ " "
                        ++ (App.Helpers.formatTime (Date.fromTime time))

                id = case app.comments of
                    Just comments -> 
                        (List.length comments) + 1
                    Nothing -> 
                        1

                maybeComment =
                    new
                        id
                        datetime
                        app
            in
                case maybeComment of
                    Just comment ->
                        case app.comments of
                            Just comments -> 
                                ( { app | comments = Just (comment :: comments) }
                                , App.Helpers.navigate <| App.Routing.RaceDetails comment.raceId
                                )

                            Nothing ->
                                ( app, Cmd.none )

                    Nothing ->
                        ( app, Cmd.none )

        Nothing ->
            ( app, Cmd.none )


new : Int -> String -> App -> Maybe Comment
new id datetime app =
    case app.page of
        App.Model.CommentAdd commentAdd ->
            case app.riders of
                Just riders ->
                    newComment id datetime riders commentAdd
                Nothing ->
                    Nothing
        _ ->
            Nothing


addRiderName : String -> Comment.Model.Add -> Comment.Model.Add
addRiderName name commentAdd =
    { commentAdd | riderName = name }

newComment : Int -> String -> List Rider.Model.Rider -> Comment.Model.Add -> Maybe Comment
newComment id datetime riders commentAdd =
    case getRiderByName commentAdd.riderName riders of
        Just rider ->
            Just <|
                Comment
                    id
                    datetime
                    commentAdd.raceId
                    rider.id
                    commentAdd.text

        Nothing ->
            Nothing


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

-- Helpers


getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)
