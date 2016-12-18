module App.Update exposing (update)

import App.Model exposing (App)
import App.Routing
import App.Decoder
import App.Encoder
import App.Msg exposing (Msg(..))
import App.UrlUpdate
import Race.Model exposing (Race)
import Rider.Model
import Comment.Model
import Account.Model
import Result.Model
import Result.Update
import Comment.Update
import Account.Update
import Race.Update
import Navigation
import String
import Debug
import Array
import Set
import Json.Decode
import App.Decoder
import Date
import Time
import Date.Extra
import Task
import Keyboard.Extra
import Dom
import WebSocket
import Phoenix.Socket
import Phoenix.Push
import Json.Encode
import Json.Decode
import App.Helpers


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case msg of
        RaceAdd ->
            Race.Update.add app

        RaceName name ->
            Race.Update.addName name app

        RaceAddCategory category ->
            Race.Update.addCategory category app

        RaceDate newDate ->
            Race.Update.addDate newDate app

        ResultAdd ->
            Result.Update.add app

        ResultAddCategory category ->
            Result.Update.addCategory category app

        ResultAddStrava link ->
            Result.Update.addStrava link app

        ResultAddResult value ->
            Result.Update.addResult value app

        ResultRiderName name ->
            Result.Update.riderName app name

        CommentAddSetText text ->
            Comment.Update.addText text app

        CommentAddSetRiderName riderName ->
            Comment.Update.addRiderName riderName app

        CommentAdd ->
            Comment.Update.add app

        CommentAddWithTime maybeTime ->
            Comment.Update.addWithTime maybeTime app

        SetRaceAdd maybeNow ->
            Race.Update.addSet maybeNow app

        RaceAddYesterday ->
            Race.Update.addYesterday app

        RaceAddYesterdayWithDate maybeDate ->
            Race.Update.addYesterdayWithDate maybeDate app

        RaceAddToday ->
            Race.Update.addToday app

        RaceAddTodayWithDate maybeDate ->
            Race.Update.addTodayWithDate maybeDate app

        UrlUpdate route ->
            App.UrlUpdate.urlUpdate route app

        NavigateTo route ->
            ( app, Navigation.newUrl <| App.Routing.reverse route )

        AccountLogin ->
            Account.Update.login app

        AccountLoginName name ->
            Account.Update.loginName name app

        AccountLoginPassword password ->
            Account.Update.loginPassword password app

        AccountLogout ->
            Account.Update.logout app

        AccountSignup ->
            Account.Update.signup app

        SocketAccountSignup ->
            Account.Update.signupSocket app
            

        SocketAccountSignupResponse rawResponse ->
            Account.Update.signupSocketResponse rawResponse app
          

        OnCreatedRider rawResponse ->
            let
                riderResult =
                    Json.Decode.decodeValue App.Decoder.riderDecoder rawResponse
            in
                case riderResult of
                    Ok rider ->
                        let
                            newRider =
                                Rider.Model.Rider
                                    rider.id
                                    rider.name
                                    rider.licence
                        in
                            ( { app | riders = Just (newRider :: (Maybe.withDefault [] app.riders)) }
                            , Cmd.none
                            )

                    _ ->
                        ( app, Cmd.none )

        AccountSignupName name ->
            Account.Update.signupName name app
          

        AccountLicence licence ->
            Account.Update.settingsLicence licence app
           

        SocketAccountLicence ->
            Account.Update.settingsLicenceSocket app
           

        SocketAccountLicenceResponse rawResponse ->
            Account.Update.settingsLicenceSocketResponse rawResponse app

        OnUpdatedRider rawResponse ->
            let
                riderResult =
                    Debug.log "riderResult in onUpdatedRider" (Json.Decode.decodeValue App.Decoder.riderDecoder rawResponse)
            in
                case riderResult of
                    Ok rider ->
                        let
                            riders =
                                Debug.log
                                    "updatedRiders: "
                                    (App.Helpers.updateRiderLicence rider.id rider.licence (Maybe.withDefault [] app.riders))

                            nextAccount =
                                case app.account of
                                    Just account ->
                                        case account.id == rider.id of
                                            True ->
                                                Just { account | licence = rider.licence }

                                            False ->
                                                Just account

                                    Nothing ->
                                        Nothing
                        in
                            ( { app
                                | riders = Just riders
                                , account = nextAccount
                              }
                            , Cmd.none
                            )

                    _ ->
                        ( app, Cmd.none )

        -- TODO: link account to one rider?
        Noop ->
            ( app, Cmd.none )

        Connect ->
            let
                payload =
                    Json.Encode.object
                        [ ( "body", Json.Encode.string "bodyValue" ) ]

                phxPush =
                    Phoenix.Push.init "riders" "room:lobby"
                        |> Phoenix.Push.withPayload payload
                        |> Phoenix.Push.onOk ReceiveRiders
                        -- |> Phoenix.Push.onOk ReceiveMessage
                        |>
                            Phoenix.Push.onError HandleSendError

                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.push phxPush app.phxSocket
            in
                ( { app | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        ReceiveRiders message ->
            let
                resultRiders =
                    (Json.Decode.decodeValue
                        (Json.Decode.field "riders" (Json.Decode.list App.Decoder.riderDecoder))
                        message
                    )

                messages =
                    (toString message) :: app.messages
            in
                case resultRiders of
                    Ok riders ->
                        ( { app | messages = messages, riders = Just riders }
                        , Cmd.none
                        )

                    Err errorMessage ->
                        let
                            b =
                                Debug.log "ReceiveRiders" errorMessage
                        in
                            ( { app | messages = messages }
                            , Cmd.none
                            )

        ReceiveMessage message ->
            let
                a =
                    Debug.log "message" message

                messages =
                    (toString message) :: app.messages
            in
                ( { app | messages = messages }
                , Cmd.none
                )

        HandleSendError _ ->
            ( app, Cmd.none )

        NewMessage message ->
            let
                messages =
                    message :: app.messages
            in
                ( { app | messages = messages }
                , Cmd.none
                )

        PhoenixMsg message ->
            let
                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.update message app.phxSocket
            in
                ( { app | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )
