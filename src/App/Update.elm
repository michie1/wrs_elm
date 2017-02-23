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
import Rider.Update


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    let
        noOp =
            ( app, Cmd.none )
    in
        case msg of
            RaceAdd ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        case Race.Update.add raceAdd app.phxSocket of
                            Just ( phxSocket, nextCmd ) ->
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
                        ( app, cmd )

                    Nothing ->
                        noOp

            RaceName name ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    { app | page = page } ! []

            RaceAddCategory category ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    { app | page = page } ! []

            RaceDate newDate ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    { app | page = page } ! []

            ResultAdd ->
                case app.page of
                    App.Model.ResultAdd resultAdd ->
                        case app.riders of
                            Just riders ->
                                case Result.Update.add resultAdd riders app.results app.phxSocket of
                                    Just ( phxSocket, phxCmd ) ->
                                        ( { app | phxSocket = phxSocket }
                                        , phxCmd
                                        )

                                    Nothing ->
                                        noOp

                            Nothing ->
                                noOp

                    _ ->
                        noOp

            ResultAddSocketResponse rawResponse ->
                case Result.Update.addSocketResponse rawResponse of
                    Just navigateCmd ->
                        ( app, navigateCmd )

                    Nothing ->
                        noOp

            ResultAddCategory category ->
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

            ResultsSocket ->
                Result.Update.resultsSocket app

            ResultsSocketResponse rawResponse ->
                Result.Update.resultsSocketResponse rawResponse app

            CommentsSocket ->
                Comment.Update.commentsSocket app

            CommentsSocketResponse rawResponse ->
                Comment.Update.commentsSocketResponse rawResponse app

            CommentAddSetText text ->
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
                case app.page of
                    App.Model.CommentAdd commentAdd ->
                        case app.riders of
                            Just riders ->
                                case Comment.Update.add commentAdd riders app.phxSocket of
                                    Just ( phxSocket, nextCmd ) ->
                                        ( { app | phxSocket = phxSocket }
                                        , nextCmd
                                        )

                                    Nothing ->
                                        noOp

                            Nothing ->
                                noOp

                    _ ->
                        noOp

            --Comment.Update.add app
            CommentAddSocketResponse rawResponse ->
                case Comment.Update.addSocketResponse rawResponse of
                    Just cmd ->
                        ( app, cmd )

                    Nothing ->
                        noOp

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

            RidersSocket ->
                Rider.Update.ridersSocket app

            RidersSocketResponse rawResponse ->
                Rider.Update.ridersSocketResponse rawResponse app

            OnJoinResponse rawResponse ->
                let
                    _ =
                        Debug.log "OnJoinResponse" rawResponse
                in
                    ( app, Cmd.none )

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
                                ( { app | races = Just (newRace :: (Maybe.withDefault [] app.races)) }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            OnCreatedResult rawResponse ->
                let
                    resultResult =
                        Json.Decode.decodeValue App.Decoder.resultDecoder rawResponse
                in
                    case resultResult of
                        Ok result ->
                            let
                                newResult =
                                    Result.Model.Result
                                        result.id
                                        result.riderId
                                        result.raceId
                                        result.result
                                        Result.Model.CatA
                                        result.strava
                            in
                                ( { app | results = newResult :: app.results }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            OnCreatedComment rawResponse ->
                let
                    commentResult =
                        Json.Decode.decodeValue App.Decoder.commentDecoder rawResponse
                in
                    case commentResult of
                        Ok comment ->
                            let
                                newComment =
                                    Comment.Model.Comment
                                        comment.id
                                        comment.updatedAt
                                        comment.raceId
                                        comment.riderId
                                        comment.text
                            in
                                ( { app | comments = Just (newComment :: (Maybe.withDefault [] app.comments)) }
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
                        Phoenix.Push.init "init" "room:lobby"
                            |> Phoenix.Push.withPayload payload
                            |> Phoenix.Push.onOk ConnectResponse
                            |> Phoenix.Push.onError HandleSendError

                    ( phxSocket, phxCmd ) =
                        Phoenix.Socket.push phxPush app.phxSocket

                    _ =
                        Debug.log "Connect" "connect"
                in
                    ( { app | phxSocket = phxSocket }
                    , Cmd.map PhoenixMsg phxCmd
                    )

            ConnectResponse value ->
                let
                    _ =
                        Debug.log "ConnectResponse" value
                in
                    ( { app | connected = True }
                    , (Task.perform
                        identity
                        (Task.succeed App.Msg.RidersSocket)
                      )
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
                let
                    _ =
                        Debug.log "receiveMessage" message
                in
                    --( { app | messages = (toString message) :: app.messages }
                    --( { app | connected = True }
                    ( app
                    , Cmd.none
                    )

            HandleSendError _ ->
                noOp

            NewMessage message ->
                ( { app | messages = message :: app.messages }
                , Cmd.none
                )

            PhoenixMsg message ->
                let
                    ( phxSocket, phxCmd ) =
                        Phoenix.Socket.update message app.phxSocket
                in
                    --( { app | connected = True, phxSocket = phxSocket }
                    ( { app | phxSocket = phxSocket }
                    , Cmd.map PhoenixMsg phxCmd
                    )

            OnJoin ->
                let
                    _ =
                        Debug.log "onJoin" "success"
                in
                    ( { app | connected = True }
                    , Cmd.batch
                        [ Task.perform
                            identity
                            (Task.succeed App.Msg.RidersSocket)
                        , Task.perform
                            identity
                            (Task.succeed App.Msg.RacesSocket)
                        , Task.perform
                            identity
                            (Task.succeed App.Msg.ResultsSocket)
                        , Task.perform
                            identity
                            (Task.succeed App.Msg.CommentsSocket)
                        ]
                    )

            DatePicked dateString ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        let
                            page =
                                Race.Update.addPage2 (App.Msg.RaceDate dateString) app.page

                            -- nextRaceAdd = { raceAdd | dateString = dateString }
                        in
                            ( { app | page = page }, Cmd.none )

                    _ ->
                        ( app, Cmd.none )
