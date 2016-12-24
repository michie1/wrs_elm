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
    let
        noop =
            ( app, Cmd.none )
    in
        case msg of
            RaceAdd ->
                case app.raceAdd of
                    Just raceAdd ->
                        case Race.Update.add raceAdd app.phxSocket of
                            Just ( phxSocket, nextCmd ) ->
                                ( { app | phxSocket = phxSocket }
                                , nextCmd
                                )

                            Nothing ->
                                noop

                    Nothing ->
                        noop

            RaceAddSocketResponse rawResponse ->
                ( app
                , Maybe.withDefault Cmd.none <| Race.Update.addSocketResponse rawResponse
                )

            RaceName name ->
                ( case app.raceAdd of
                    Just raceAdd ->
                        { app
                            | raceAdd = Just <| Race.Update.addName name raceAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

            RaceAddCategory category ->
                ( case app.raceAdd of
                    Just raceAdd ->
                        { app
                            | raceAdd = Just <| Race.Update.addCategory category raceAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

            RaceDate newDate ->
                ( case app.raceAdd of
                    Just raceAdd ->
                        { app
                            | raceAdd = Just <| Race.Update.addDate newDate raceAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

            ResultAdd ->
                Maybe.withDefault
                    noop
                    (Maybe.map2
                        (\resultAdd riders ->
                            case Result.Update.add resultAdd riders app.results of
                                Just ( result, navigateCmd ) ->
                                    ( { app | results = result :: app.results }
                                    , navigateCmd
                                    )

                                Nothing ->
                                    noop
                        )
                        app.resultAdd
                        app.riders
                    )

            ResultAddCategory category ->
                ( (case app.resultAdd of
                    Just resultAdd ->
                        { app
                            | resultAdd =
                                Just <| Result.Update.addCategory category resultAdd
                        }

                    Nothing ->
                        app
                  )
                , Cmd.none
                )

            ResultAddStrava link ->
                ( case app.resultAdd of
                    Just resultAdd ->
                        { app
                            | resultAdd =
                                Just <| Result.Update.addStrava link resultAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

            ResultAddResult value ->
                ( case app.resultAdd of
                    Just resultAdd ->
                        { app 
                            | resultAdd =
                                Just <| Result.Update.addResult value resultAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

            ResultRiderName name ->
                ( case app.resultAdd of
                    Just resultAdd ->
                        { app
                            | resultAdd =
                                Just <| Result.Update.riderName name resultAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

            CommentAddSetText text ->
                ( case app.commentAdd of
                    Just commentAdd ->
                        { app
                            | commentAdd =
                                Just <| Comment.Update.addText text commentAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

            CommentAddSetRiderName riderName ->
                ( case app.commentAdd of
                    Just commentAdd ->
                        { app
                            | commentAdd =
                                Just <| Comment.Update.addRiderName riderName commentAdd
                        }

                    Nothing ->
                        app
                , Cmd.none
                )

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
                ( app, App.Helpers.navigate route )

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

            AccountSignupName name ->
                Account.Update.signupName name app

            AccountLicence licence ->
                Account.Update.settingsLicence licence app

            SocketAccountLicence ->
                Account.Update.settingsLicenceSocket app

            SocketAccountLicenceResponse rawResponse ->
                Account.Update.settingsLicenceSocketResponse rawResponse app

            RacesSocket ->
                Race.Update.racesSocket app

            RacesSocketResponse rawResponse ->
                Race.Update.racesSocketResponse rawResponse app

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

                        Err _ ->
                            noop

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
                                ( { app | races = Just (newRace :: (Maybe.withDefault [] app.races)) }
                                , Cmd.none
                                )

                        Err _ ->
                            noop

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

                        Err _ ->
                            noop

            -- TODO: link account to one rider?
            Noop ->
                noop

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
                            ( { app | messages = messages }
                            , Cmd.none
                            )

            ReceiveMessage message ->
                ( { app | messages = (toString message) :: app.messages }
                , Cmd.none
                )

            HandleSendError _ ->
                noop

            NewMessage message ->
                ( { app | messages = message :: app.messages }
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
