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
import Result.Model
import Result.Update
import Comment.Update
import Account.Update
import Race.Update
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
    case maybeUpdate msg app of
        Just next ->
            next

        Nothing ->
            app ! []


maybeUpdate : Msg -> App -> Maybe ( App, Cmd Msg )
maybeUpdate msg app =
    let
        noOp =
            Nothing
    in
        case msg of
            RaceAdd ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        case Race.Update.add raceAdd app.phxSocket of
                            Just ( phxSocket, nextCmd ) ->
                                Just <|
                                    ( { app | phxSocket = phxSocket }
                                    , nextCmd
                                    )

                            Nothing ->
                                noOp

                    _ ->
                        noOp

            RaceAddSocketResponse rawResponse ->
                case Race.Update.addSocketResponse rawResponse of
                    Just cmd ->
                        Just ( app, cmd )

                    Nothing ->
                        noOp

            RaceName name ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    Just <| { app | page = page } ! []

            RaceAddCategory category ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    Just <| { app | page = page } ! []

            RaceDate newDate ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    Just <| { app | page = page } ! []

            ResultAdd ->
                case app.page of
                    App.Model.ResultAdd resultAdd ->
                        case app.riders of
                            Just riders ->
                                case Result.Update.add resultAdd riders app.results of
                                    Just ( result, navigateCmd ) ->
                                        Just <|
                                            ( { app | results = result :: app.results }
                                            , navigateCmd
                                            )

                                    Nothing ->
                                        noOp

                            Nothing ->
                                noOp

                    _ ->
                        noOp

            ResultAddCategory category ->
                Just <|
                    ( (case app.page of
                        App.Model.ResultAdd resultAdd ->
                            { app
                                | page =
                                    App.Model.ResultAdd <| Result.Update.addCategory category resultAdd
                            }

                        _ ->
                            app
                      )
                    , Cmd.none
                    )

            ResultAddStrava link ->
                Just <|
                    ( case app.page of
                        App.Model.ResultAdd resultAdd ->
                            { app
                                | page =
                                    App.Model.ResultAdd <| Result.Update.addStrava link resultAdd
                            }

                        _ ->
                            app
                    , Cmd.none
                    )

            ResultAddResult value ->
                Just <|
                    ( case app.page of
                        App.Model.ResultAdd resultAdd ->
                            { app
                                | page =
                                    App.Model.ResultAdd <| Result.Update.addResult value resultAdd
                            }

                        _ ->
                            app
                    , Cmd.none
                    )

            ResultRiderName name ->
                Just <|
                    ( case app.page of
                        App.Model.ResultAdd resultAdd ->
                            { app
                                | page =
                                    App.Model.ResultAdd <| Result.Update.riderName name resultAdd
                            }

                        _ ->
                            app
                    , Cmd.none
                    )

            CommentAddSetText text ->
                Just <|
                    ( case app.page of
                        App.Model.CommentAdd commentAdd ->
                            { app
                                | page =
                                    App.Model.CommentAdd <| Comment.Update.addText text commentAdd
                            }

                        _ ->
                            app
                    , Cmd.none
                    )

            CommentAddSetRiderName riderName ->
                Just <|
                    ( case app.page of
                        App.Model.CommentAdd commentAdd ->
                            { app
                                | page =
                                    App.Model.CommentAdd <| Comment.Update.addRiderName riderName commentAdd
                            }

                        _ ->
                            app
                    , Cmd.none
                    )

            CommentAdd ->
                Just <| Comment.Update.add app

            CommentAddWithTime maybeTime ->
                Just <| Comment.Update.addWithTime maybeTime app

            SetRaceAdd maybeNow ->
                Just <| Race.Update.addSet maybeNow app

            RaceAddYesterday ->
                Just <| Race.Update.addYesterday app

            RaceAddYesterdayWithDate maybeDate ->
                Just <| Race.Update.addYesterdayWithDate maybeDate app

            RaceAddToday ->
                Just <| Race.Update.addToday app

            RaceAddTodayWithDate maybeDate ->
                Just <| Race.Update.addTodayWithDate maybeDate app

            UrlUpdate route ->
                Just <| App.UrlUpdate.urlUpdate route app

            NavigateTo route ->
                Just <| ( app, App.Helpers.navigate route )

            AccountLogin ->
                Just <| Account.Update.login app

            AccountLoginName name ->
                Just <| Account.Update.loginName name app

            AccountLoginPassword password ->
                Just <| Account.Update.loginPassword password app

            AccountLogout ->
                Just <| Account.Update.logout app

            AccountSignup ->
                Just <| Account.Update.signup app

            SocketAccountSignup ->
                Just <| Account.Update.signupSocket app

            SocketAccountSignupResponse rawResponse ->
                Just <| Account.Update.signupSocketResponse rawResponse app

            AccountSignupName name ->
                Just <| Account.Update.signupName name app

            AccountLicence licence ->
                Just <| Account.Update.settingsLicence licence app

            SocketAccountLicence ->
                Just <| Account.Update.settingsLicenceSocket app

            SocketAccountLicenceResponse rawResponse ->
                Just <| Account.Update.settingsLicenceSocketResponse rawResponse app

            RacesSocket ->
                Just <| Race.Update.racesSocket app

            RacesSocketResponse rawResponse ->
                Just <| Race.Update.racesSocketResponse rawResponse app

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
                                Just <|
                                    ( { app | riders = Just (newRider :: (Maybe.withDefault [] app.riders)) }
                                    , Cmd.none
                                    )

                        Err _ ->
                            noOp

            OnCreatedRace rawResponse ->
                let
                    raceResult =
                        Json.Decode.decodeValue App.Decoder.raceDecoder rawResponse
                in
                    case raceResult of
                        Ok race ->
                            let
                                newRace =
                                    Race.Model.Race
                                        race.id
                                        race.name
                                        race.date
                                        race.category
                            in
                                Just <|
                                    ( { app | races = Just (newRace :: (Maybe.withDefault [] app.races)) }
                                    , Cmd.none
                                    )

                        Err _ ->
                            noOp

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
                                Just <|
                                    ( { app
                                        | riders = Just riders
                                        , account = nextAccount
                                      }
                                    , Cmd.none
                                    )

                        Err _ ->
                            noOp

            -- TODO: link account to one rider?
            Noop ->
                noOp

            Connect ->
                let
                    payload =
                        Json.Encode.object
                            [ ( "body", Json.Encode.string "bodyValue" ) ]

                    phxPush =
                        Phoenix.Push.init "riders" "room:lobby"
                            |> Phoenix.Push.withPayload payload
                            |> Phoenix.Push.onOk ReceiveRiders
                            |> Phoenix.Push.onError HandleSendError

                    ( phxSocket, phxCmd ) =
                        Phoenix.Socket.push phxPush app.phxSocket
                in
                    Just <|
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
                            Just <|
                                ( { app | messages = messages, riders = Just riders }
                                , Cmd.none
                                )

                        Err errorMessage ->
                            Just <|
                                ( { app | messages = messages }
                                , Cmd.none
                                )

            ReceiveMessage message ->
                Just <|
                    ( { app | messages = (toString message) :: app.messages }
                    , Cmd.none
                    )

            HandleSendError _ ->
                noOp

            NewMessage message ->
                Just <|
                    ( { app | messages = message :: app.messages }
                    , Cmd.none
                    )

            PhoenixMsg message ->
                let
                    ( phxSocket, phxCmd ) =
                        Phoenix.Socket.update message app.phxSocket
                in
                    Just <|
                        ( { app | phxSocket = phxSocket }
                        , Cmd.map PhoenixMsg phxCmd
                        )
