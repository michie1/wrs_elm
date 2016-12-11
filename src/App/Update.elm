port module App.Update exposing (update, calcRaceId)

import App.Model exposing (App)
import App.Routing
import App.Decoder
import App.Encoder
import App.Msg exposing (Msg(..))
import App.Commands
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


type alias StoredApp =
    { page : String
    , riders : List Rider.Model.Rider
    , races : List Race.Model.Race
    , comments : List Comment.Model.Comment
    , results : List Result.Model.Result
    }


port saveState : String -> Cmd msg


port resetState : String -> Cmd msg


port updateMaterialize : () -> Cmd msg


port autocomplete : ( String, List String ) -> Cmd msg


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
                                        (calcRaceId app.races)
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

        SetRaceName newName ->
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

        SetRaceDate newDate ->
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

        AddRider rider ->
            Rider.Update.addRider app rider

        SetRiderName newName ->
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

        SetResultAddResult value ->
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

        SetResultRiderName name ->
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
                        (Just >> App.Msg.CommentAdd2)
                        Time.now
            in
                ( app, Cmd.batch [ nowTask ] )

        CommentAdd2 maybeTime ->
            case maybeTime of
                Just time ->
                    let
                        datetime =
                            (formatTime (Date.fromTime time)) ++ " " ++ (formatDate (Date.fromTime time))

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

        Save ->
            ( app
            , saveState (Debug.log "alert message" "message")
            )

        Log message ->
            let
                m =
                    Debug.log "message" message
            in
                ( app
                , Cmd.none
                )

        Reset ->
            App.Model.initial

        UpdateMaterialize ->
            let
                bla =
                    Debug.log "update Materialize" "bla"
            in
                ( app, updateMaterialize () )

        SetNow maybeDate ->
            ( { app | now = maybeDate }
            , Cmd.none
            )

        SetRaceAdd maybeNow ->
            case app.raceAdd of
                Just currentRaceAdd ->
                    let
                        dateFormatted =
                            case maybeNow of
                                Just now ->
                                    formatDate now

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

        SetRaceAddYesterday ->
            let
                yesterdayTask =
                    Task.perform
                        (Just >> App.Msg.SetRaceAddYesterday2)
                        Date.now
            in
                ( app, Cmd.batch [ yesterdayTask, updateMaterialize () ] )

        SetRaceAddYesterday2 maybeDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        dateFormatted =
                            case maybeDate of
                                Just date ->
                                    formatDate (Date.Extra.add Date.Extra.Day (-1) date)

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

        SetRaceAddToday ->
            let
                todayTask =
                    Task.perform
                        (Just >> App.Msg.SetRaceAddToday2)
                        Date.now
            in
                ( app, Cmd.batch [ todayTask, updateMaterialize () ] )

        SetRaceAddToday2 maybeDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        dateFormatted =
                            case maybeDate of
                                Just date ->
                                    formatDate date

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
                            getRiderByName
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
                                    (updateRiderLicence rider.id rider.licence (Maybe.withDefault [] app.riders))

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
        KeyDown keyCode ->
            case keyCode of
                13 ->
                    let
                        a =
                            Debug.log "keyCode" "enter"
                    in
                        ( app, Cmd.none )

                _ ->
                    ( app, Cmd.none )

        KeyboardMsg keyMsg ->
            let
                a =
                    Debug.log "keyMsg" keyMsg

                ( keyboardModel, keyboardCmd ) =
                    Keyboard.Extra.update keyMsg app.keyboardModel

                cmd =
                    case (Keyboard.Extra.isPressed Keyboard.Extra.Enter keyboardModel && app.raceAdd /= Nothing) of
                        True ->
                            Task.perform identity (Task.succeed RaceAdd)

                        False ->
                            Cmd.none
            in
                ( { app | keyboardModel = keyboardModel }
                , cmd
                  -- , Cmd.map KeyboardMsg keyboardCmd TODO: check why it looks like its not needed now
                )

        Noop ->
            ( app, Cmd.none )

        Input input ->
            let
                newApp =
                    { app | input = input }
            in
                ( newApp, Cmd.none )

        Connect ->
            let
                payload =
                    Json.Encode.object
                        [ ( "body", Json.Encode.string app.input ) ]

                phxPush =
                    Phoenix.Push.init "riders" "room:lobby"
                        |> Phoenix.Push.withPayload payload
                        |> Phoenix.Push.onOk ReceiveRiders
                        -- |> Phoenix.Push.onOk ReceiveMessage
                        |>
                            Phoenix.Push.onError HandleSendError

                -- TODO: listen for createdRider
                -- TODO: listen for updatedRider
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


updateRiderLicence : Int -> Maybe Rider.Model.Licence -> List Rider.Model.Rider -> List Rider.Model.Rider
updateRiderLicence riderId maybeLicence riders =
    List.map
        (\rider ->
            case rider.id == riderId of
                True ->
                    { rider | licence = maybeLicence }

                False ->
                    rider
        )
        riders


getRiderById : Int -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderById id riders =
    List.head (List.filter (\rider -> rider.id == id) riders)


getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)


getRiderIdByIndex : Int -> List Rider.Model.Rider -> Int
getRiderIdByIndex index riders =
    let
        arrayRiders =
            Array.fromList riders

        maybeRider =
            Array.get index arrayRiders
    in
        case maybeRider of
            Nothing ->
                0

            Just rider ->
                rider.id


calcRaceId : List Race -> Int
calcRaceId races =
    (List.length races) + 1


numMonth : Date.Month -> Int
numMonth month =
    case month of
        Date.Jan ->
            1

        Date.Feb ->
            2

        Date.Mar ->
            3

        Date.Apr ->
            4

        Date.May ->
            5

        Date.Jun ->
            6

        Date.Jul ->
            7

        Date.Aug ->
            8

        Date.Sep ->
            9

        Date.Oct ->
            10

        Date.Nov ->
            11

        Date.Dec ->
            12


leadingZero : Int -> String
leadingZero value =
    if value < 10 then
        "0" ++ toString value
    else
        toString value


formatTime : Date.Date -> String
formatTime datetime =
    toString (Date.hour datetime)
        -- TODO: use leadingZero
        ++
            ":"
        ++ toString (Date.minute datetime)


formatDate : Date.Date -> String
formatDate date =
    (leadingZero (Date.day date))
        ++ "-"
        ++ toString (numMonth (Date.month date))
        ++ "-"
        ++ toString (Date.year date)


setRaceAdd : Cmd Msg
setRaceAdd =
    Task.perform
        (Just >> App.Msg.SetRaceAdd)
        Date.now
