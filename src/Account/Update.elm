module Account.Update exposing (signupSocket, signupSocketResponse, logout, login, loginName, loginPassword, signup, signupName, settingsLicenceSocket, settingsLicence, settingsLicenceSocketResponse)

import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Helpers
import Task
import Rider.Model
import Phoenix.Socket
import Phoenix.Push
import Json.Encode
import Json.Decode
import App.Encoder
import App.Routing


loginName : String -> App -> ( App, Cmd Msg )
loginName name app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                nextAccountLogin =
                    { accountLogin | name = name }
            in
                ( { app | page = App.Model.AccountLogin nextAccountLogin }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


loginPassword : String -> App -> ( App, Cmd Msg )
loginPassword password app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                nextAccountLogin =
                    { accountLogin | password = password }
            in
                ( { app | page = App.Model.AccountLogin nextAccountLogin }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


logout : App -> ( App, Cmd Msg )
logout app =
    case app.account of
        Just account ->
            ( { app | account = Nothing }
            , App.Helpers.navigate <| App.Routing.Home
            )

        Nothing ->
            ( app, Cmd.none )


login : App -> ( App, Cmd Msg )
login app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                maybeRider =
                    App.Helpers.getRiderByName
                        accountLogin.name
                        (Maybe.withDefault [] app.riders)
            in
                case maybeRider of
                    Just rider ->
                        ( { app | account = maybeRider }
                        , App.Helpers.navigate App.Routing.Home
                        )

                    Nothing ->
                        ( app, Cmd.none )

        _ ->
            ( app, Cmd.none )


signup : App -> ( App, Cmd Msg )
signup app =
    case app.page of
        App.Model.AccountSignup accountSignup ->
            -- TODO do not add directly, but send websocket to add new rider
            let
                newRider =
                    Rider.Model.Rider
                        ((List.length (Maybe.withDefault [] app.riders)) + 1)
                        accountSignup.name
                        Nothing
            in
                ( app
                , Cmd.batch
                    [ Task.perform
                        identity
                        (Task.succeed App.Msg.SocketAccountSignup)
                    ]
                )

        _ ->
            ( app, Cmd.none )


signupSocket : App -> ( App, Cmd Msg )
signupSocket app =
    case app.page of
        App.Model.AccountSignup accountSignup ->
            let
                payload =
                    Json.Encode.object [ ( "name", Json.Encode.string accountSignup.name ) ]

                phxPush =
                    Phoenix.Push.init "createRider" "room:lobby"
                        |> Phoenix.Push.withPayload payload
                        |> Phoenix.Push.onOk SocketAccountSignupResponse
                        |> Phoenix.Push.onError HandleSendError

                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.push phxPush app.phxSocket
            in
                ( { app | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        _ ->
            ( app, Cmd.none )


signupSocketResponse : Json.Decode.Value -> App -> ( App, Cmd Msg )
signupSocketResponse rawResponse app =
    let
        name =
            Result.withDefault ""
                (Json.Decode.decodeValue
                    (Json.Decode.field "name" Json.Decode.string)
                    rawResponse
                )
    in
        ( app
        , App.Helpers.navigate <| App.Routing.AccountLoginName name
        )


signupName : String -> App -> ( App, Cmd Msg )
signupName name app =
    case app.page of
        App.Model.AccountSignup accountSignup ->
            let
                nextAccountSignup =
                    { accountSignup | name = name }
            in
                ( { app | page = App.Model.AccountSignup nextAccountSignup }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


settingsLicence : Rider.Model.Licence -> App -> ( App, Cmd Msg )
settingsLicence licence app =
    case app.account of
        Just account ->
            let
                nextAccount =
                    { account | licence = Just licence }
            in
                ( { app | account = Just nextAccount }
                , Cmd.batch
                    [ Task.perform
                        identity
                        (Task.succeed App.Msg.SocketAccountLicence)
                    ]
                )

        Nothing ->
            ( app, Cmd.none )


settingsLicenceSocket : App -> ( App, Cmd Msg )
settingsLicenceSocket app =
    case app.account of
        Just account ->
            let
                payload =
                    Json.Encode.object [ ( "id", Json.Encode.int account.id ), ( "licence", App.Encoder.licence account.licence ) ]

                phxPush =
                    Phoenix.Push.init "updateRider" "room:lobby"
                        |> Phoenix.Push.withPayload payload
                        |> Phoenix.Push.onOk SocketAccountLicenceResponse
                        |> Phoenix.Push.onError HandleSendError

                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.push phxPush app.phxSocket
            in
                ( { app | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        Nothing ->
            ( app, Cmd.none )


settingsLicenceSocketResponse : Json.Encode.Value -> App -> ( App, Cmd Msg )
settingsLicenceSocketResponse rawResponse app =
    case app.account of
        Just account ->
            let
                licence =
                    Debug.log "licence "
                        (Result.withDefault ""
                            (Json.Decode.decodeValue
                                (Json.Decode.field "licence" Json.Decode.string)
                                rawResponse
                            )
                        )

                nextAccount =
                    account
            in
                ( { app
                    | account =
                        Just nextAccount
                  }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )
