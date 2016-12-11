port module App.Update exposing (update)

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
import Rider.Update
import Result.Update
import Comment.Update
import Account.Update
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
            case app.raceAdd of
                Just raceAdd ->
                    case raceAdd.name /= "" of
                        True ->
                            let
                                dateString =
                                    Maybe.withDefault "" raceAdd.dateString

                                newRace =
                                    Race.Model.Race
                                        (App.Helpers.calcRaceId app.races)
                                        raceAdd.name
                                        dateString
                                        raceAdd.category
                            in
                                ( { app
                                    | races =
                                        (newRace :: app.races)
                                  }
                                , Navigation.newUrl ("#races/" ++ (toString newRace.id))
                                )

                        False ->
                            ( app, Cmd.none )

                Nothing ->
                    ( app, Cmd.none )

        RaceName newName ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        newRaceAdd =
                            { raceAdd | name = newName }
                    in
                        ( { app
                            | raceAdd = Just newRaceAdd
                          }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        RaceAddCategory category ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        nextRaceAdd =
                            { raceAdd | category = category }
                    in
                        ( { app | raceAdd = Just nextRaceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        RaceDate newDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        newRaceAdd =
                            { raceAdd | dateString = Just newDate }
                    in
                        ( { app
                            | raceAdd = Just newRaceAdd
                          }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        RiderAdd rider ->
            Rider.Update.add app rider

        RiderName newName ->
            Rider.Update.setRiderAddName app newName

        ResultAdd ->
            let
                ( maybeResult, cmd ) =
                    Result.Update.addResult app
            in
                case maybeResult of
                    Just result ->
                        ( { app | results = result :: app.results }
                        , cmd
                        )

                    Nothing ->
                        ( app, cmd )

        ResultAddCategory category ->
            case app.resultAdd of
                Just resultAdd ->
                    let
                        nextResultAdd =
                            { resultAdd | category = category }
                    in
                        ( { app | resultAdd = Just nextResultAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        ResultAddStrava link ->
            case app.resultAdd of
                Just resultAdd ->
                    let
                        nextResultAdd =
                            { resultAdd | strava = link }
                    in
                        ( { app | resultAdd = Just nextResultAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        ResultAddResult value ->
            case app.resultAdd of
                Just resultAdd ->
                    let
                        resultAddWithResult =
                            { resultAdd | result = value }
                    in
                        ( { app | resultAdd = Just resultAddWithResult }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        ResultRiderName name ->
            let
                a =
                    Debug.log "name" name
            in
                Result.Update.setRider app name

        CommentAddSetText text ->
            case app.commentAdd of
                Just commentAdd ->
                    let
                        commentAddWithText =
                            { commentAdd
                                | text =
                                    text
                            }
                    in
                        ( { app | commentAdd = Just commentAddWithText }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        CommentAddSetRiderName riderName ->
            case app.commentAdd of
                Just commentAdd ->
                    let
                        commentAddWithRiderName =
                            { commentAdd | riderName = riderName }
                    in
                        ( { app | commentAdd = Just commentAddWithRiderName }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        CommentAdd ->
            let
                nowTask =
                    Task.perform
                        (Just >> App.Msg.CommentAddWithTime)
                        Time.now
            in
                ( app, Cmd.batch [ nowTask ] )

        CommentAddWithTime maybeTime ->
            case maybeTime of
                Just time ->
                    let
                        datetime =
                            (App.Helpers.formatTime (Date.fromTime time)) ++ " " ++ (App.Helpers.formatDate (Date.fromTime time))

                        ( comment, cmd ) =
                            Comment.Update.new
                                ((List.length app.comments) + 1)
                                datetime
                                app
                    in
                        ( { app
                            | comments = (Debug.log "comment2" comment) :: app.comments
                            , commentAdd = Nothing
                          }
                        , cmd
                        )

                Nothing ->
                    ( app, Cmd.none )



        SetRaceAdd maybeNow ->
            case app.raceAdd of
                Just currentRaceAdd ->
                    let
                        dateFormatted =
                            case maybeNow of
                                Just now ->
                                    App.Helpers.formatDate now

                                Nothing ->
                                    ""

                        raceAdd =
                            { currentRaceAdd
                                | dateString = Just dateFormatted
                            }
                    in
                        ( { app | raceAdd = Just raceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        RaceAddYesterday ->
            let
                yesterdayTask =
                    Task.perform
                        (Just >> App.Msg.RaceAddYesterdayWithDate)
                        Date.now
            in
                ( app, Cmd.batch [ yesterdayTask] )

        RaceAddYesterdayWithDate maybeDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        dateFormatted =
                            case maybeDate of
                                Just date ->
                                    App.Helpers.formatDate (Date.Extra.add Date.Extra.Day (-1) date)

                                Nothing ->
                                    ""

                        newRaceAdd =
                            { raceAdd | dateString = Just dateFormatted }
                    in
                        ( { app | raceAdd = Just newRaceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        RaceAddToday ->
            let
                todayTask =
                    Task.perform
                        (Just >> App.Msg.RaceAddTodayWithDate)
                        Date.now
            in
                ( app, Cmd.batch [ todayTask] )

        RaceAddTodayWithDate maybeDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        dateFormatted =
                            case maybeDate of
                                Just date ->
                                    App.Helpers.formatDate date

                                Nothing ->
                                    ""

                        newRaceAdd =
                            { raceAdd | dateString = Just dateFormatted }
                    in
                        ( { app | raceAdd = Just newRaceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        UrlUpdate route ->
            App.UrlUpdate.urlUpdate route app

        NavigateTo route ->
            ( app, Navigation.newUrl <| App.Routing.reverse route )

        AccountLogin ->
            case app.accountLogin of
                Just accountLogin ->
                    let
                        maybeRider =
                            App.Helpers.getRiderByName
                                accountLogin.name
                                (Maybe.withDefault [] app.riders)
                    in
                        case maybeRider of
                            Just rider ->
                                ( { app | account = maybeRider }
                                , Navigation.newUrl "#home"
                                )

                            Nothing ->
                                ( app, Cmd.none )

                Nothing ->
                    ( app, Cmd.none )

        AccountLoginName name ->
            Account.Update.loginName app name

        AccountLoginPassword password ->
            case app.accountLogin of
                Just accountLogin ->
                    let
                        nextAccountLogin =
                            { accountLogin | password = password }
                    in
                        ( { app | accountLogin = Just nextAccountLogin }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        AccountLogout ->
            case app.account of
                Just account ->
                    ( { app | account = Nothing }
                    , Navigation.newUrl "#home"
                    )

                Nothing ->
                    ( app, Cmd.none )

        AccountSignup ->
            case app.accountSignup of
                Just accountSignup ->
                    -- TODO do not add directly, but send websocket to add new rider
                    let
                        newRider =
                            Rider.Model.Rider
                                ((List.length (Maybe.withDefault [] app.riders)) + 1)
                                accountSignup.name
                                Nothing
                    in
                        --( { app | riders = Just (newRider :: (Maybe.withDefault [] app.riders)) }
                        -- , Navigation.newUrl ("#account/login/" ++ newRider.name)
                        --)
                        ( app
                        , Cmd.batch
                            [ Task.perform
                                identity
                                (Task.succeed App.Msg.SocketAccountSignup)
                            ]
                        )

                Nothing ->
                    ( app, Cmd.none )

        SocketAccountSignup ->
            case app.accountSignup of
                Just accountSignup ->
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

                Nothing ->
                    ( app, Cmd.none )

        SocketAccountSignupResponse rawResponse ->
            let
                name =
                    Result.withDefault ""
                        (Json.Decode.decodeValue
                            (Json.Decode.field "name" Json.Decode.string)
                            rawResponse
                        )
            in
                ( app
                , Navigation.newUrl ("#account/login/" ++ name)
                )

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
            case app.accountSignup of
                Just accountSignup ->
                    let
                        nextAccountSignup =
                            { accountSignup | name = name }
                    in
                        ( { app | accountSignup = Just nextAccountSignup }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        AccountLicence licence ->
            case app.account of
                Just account ->
                    let
                        nextAccount =
                            { account | licence = Just licence }
                    in
                        --( { app
                        -- | account = Just nextAccount
                        --, riders = Just (updateRiderLicence account.id licence (Maybe.withDefault [] app.riders))
                        --}
                        --, Cmd.none
                        --)
                        ( { app | account = Just nextAccount }
                        , Cmd.batch
                            [ Task.perform
                                identity
                                (Task.succeed App.Msg.SocketAccountLicence)
                            ]
                        )

                Nothing ->
                    ( app, Cmd.none )

        SocketAccountLicence ->
            case app.account of
                Just account ->
                    let
                        payload =
                            --Json.Encode.object [ ( "licence", Json.Encode.string account.licence ) ]
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

        SocketAccountLicenceResponse rawResponse ->
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
                            -- { account | licence = Just licence }
                            account
                    in
                        ( { app
                            | account =
                                Just nextAccount
                                --, riders = Just (updateRiderLicence account.id licence (Maybe.withDefault [] app.riders))
                          }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        OnUpdatedRider rawResponse ->
            let
                riderResult =
                    Debug.log "riderResult in onUpdatedRider" (Json.Decode.decodeValue App.Decoder.riderDecoder rawResponse)
            in
                {--
                case riderResult of
                    Ok rider ->
                        let
                            newRider = Rider.Model.Rider
                                        rider.id
                                        rider.name
                                        rider.licence
                        in
                            ( { app | riders = Just (newRider :: (Maybe.withDefault [] app.riders)) }
                            , Cmd.none
                            )

                    _ ->
                        ( app, Cmd.none )
                --}
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
                a =
                    Debug.log "message" message

                resultRiders =
                    (Json.Decode.decodeValue
                        --(Json.Decode.field "riders" (Json.Decode.list App.Decoder.rider))
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

