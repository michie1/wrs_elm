module Race.Update exposing (..)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Helpers
import Race.Model
import Date
import Date.Extra
import Task
import App.Helpers
import App.Routing
import Phoenix.Socket
import Phoenix.Push
import Json.Encode
import Json.Decode
import App.Decoder


add :
    Race.Model.Add
    -> Phoenix.Socket.Socket App.Msg.Msg
    -> Maybe ( Phoenix.Socket.Socket App.Msg.Msg, Cmd Msg )
add raceAdd phxSocket =
    case String.isEmpty raceAdd.name of
        False ->
            Just <| addSocket raceAdd phxSocket

        True ->
            Nothing

addPage2 : App.Msg.Msg -> App.Model.Page -> App.Model.Page
addPage2 msg page =
    case page of
        App.Model.RaceAdd raceAdd ->
            case msg of
                RaceName name ->
                    App.Model.RaceAdd <| addName name raceAdd

                RaceAddCategory category ->
                    App.Model.RaceAdd <| addCategory category raceAdd

                RaceDate newDate ->
                    App.Model.RaceAdd <| addDate newDate raceAdd

                _ ->
                    page
        _ ->
            page


addPage : App.Msg.Msg -> Maybe Race.Model.Add -> Maybe Race.Model.Add
addPage msg maybeRaceAdd =
    case maybeRaceAdd of
        Just raceAdd ->
            case msg of
                RaceName name ->
                    Just <| addName name raceAdd

                RaceAddCategory category ->
                    Just <| addCategory category raceAdd

                _ ->
                    Nothing

        Nothing ->
            Nothing


addName : String -> Race.Model.Add -> Race.Model.Add
addName newName raceAdd =
    { raceAdd | name = newName }


addCategory : Race.Model.Category -> Race.Model.Add -> Race.Model.Add
addCategory category raceAdd =
    { raceAdd | category = Just category }


addDate : String -> Race.Model.Add -> Race.Model.Add
addDate newDate raceAdd =
    { raceAdd | dateString = newDate }


addSet : Maybe Date.Date -> App -> ( App, Cmd Msg )
addSet maybeNow app =
    case app.page of
        App.Model.RaceAdd currentRaceAdd ->
            let
                dateFormatted =
                    case maybeNow of
                        Just now ->
                            App.Helpers.formatDate now

                        Nothing ->
                            ""

                raceAdd =
                    { currentRaceAdd
                      --| dateString = Just dateFormatted
                        | dateString = dateFormatted
                    }
            in
                ( { app | page = App.Model.RaceAdd raceAdd }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


addYesterday : App -> ( App, Cmd Msg )
addYesterday app =
    let
        yesterdayTask =
            Task.perform
                (Just >> App.Msg.RaceAddYesterdayWithDate)
                Date.now
    in
        ( app, Cmd.batch [ yesterdayTask ] )


addYesterdayWithDate : Maybe Date.Date -> App -> ( App, Cmd Msg )
addYesterdayWithDate maybeDate app =
    case app.page of
        App.Model.RaceAdd currentRaceAdd ->
            let
                dateFormatted =
                    case maybeDate of
                        Just date ->
                            App.Helpers.formatDate (Date.Extra.add Date.Extra.Day (-1) date)

                        Nothing ->
                            ""

                newRaceAdd =
                    --{ raceAdd | dateString = Just dateFormatted }
                    { currentRaceAdd | dateString = dateFormatted }
            in
                ( { app | page = App.Model.RaceAdd newRaceAdd }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


addToday : App -> ( App, Cmd Msg )
addToday app =
    let
        todayTask =
            Task.perform
                (Just >> App.Msg.RaceAddTodayWithDate)
                Date.now
    in
        ( app, Cmd.batch [ todayTask ] )


addTodayWithDate : Maybe Date.Date -> App -> ( App, Cmd Msg )
addTodayWithDate maybeDate app =
    case app.page of
        App.Model.RaceAdd currentRaceAdd ->
            let
                dateFormatted =
                    case maybeDate of
                        Just date ->
                            App.Helpers.formatDate date

                        Nothing ->
                            ""

                newRaceAdd =
                    --{ raceAdd | dateString = Just dateFormatted }
                    { currentRaceAdd | dateString = dateFormatted }
            in
                ( { app | page = App.Model.RaceAdd newRaceAdd }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


racesSocket : App -> ( App, Cmd Msg )
racesSocket app =
    let
        _ =
            Debug.log "races" "socket"

        payload =
            Json.Encode.object [ ( "name", Json.Encode.string "hoi" ) ]

        phxPush =
            Phoenix.Push.init "races" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk RacesSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( phxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush app.phxSocket
    in
        ( { app | phxSocket = phxSocket }
        , Cmd.map PhoenixMsg phxCmd
        )


racesSocketResponse : Json.Decode.Value -> App -> ( App, Cmd Msg )
racesSocketResponse message app =
    let
        resultRaces =
            (Json.Decode.decodeValue
                (Json.Decode.field "races" (Json.Decode.list App.Decoder.raceDecoder))
                message
            )
    in
        case resultRaces of
            Ok races ->
                ( { app | races = Just races }
                , Cmd.none
                )

            Err errorMessage ->
                let
                    b =
                        Debug.log "races socket response" errorMessage
                in
                    ( app
                    , Cmd.none
                    )


addSocket : Race.Model.Add -> Phoenix.Socket.Socket App.Msg.Msg -> ( Phoenix.Socket.Socket App.Msg.Msg, Cmd Msg )
addSocket raceAdd phxSocket =
    let
        payload =
            Json.Encode.object
                [ ( "name", Json.Encode.string raceAdd.name )
                , ( "date", Json.Encode.string raceAdd.dateString )
                ]

        phxPush =
            Phoenix.Push.init "createRace" "room:lobby"
                |> Phoenix.Push.withPayload payload
                |> Phoenix.Push.onOk RaceAddSocketResponse
                |> Phoenix.Push.onError HandleSendError

        ( nextPhxSocket, phxCmd ) =
            Phoenix.Socket.push phxPush phxSocket
    in
        ( nextPhxSocket
        , Cmd.map PhoenixMsg phxCmd
        )


addSocketResponse : Json.Decode.Value -> Maybe (Cmd Msg)
addSocketResponse rawResponse =
    case Json.Decode.decodeValue (Json.Decode.field "id" Json.Decode.int) rawResponse of
        Ok id ->
            Just <| App.Helpers.navigate <| App.Routing.RaceDetails id

        Err _ ->
            Nothing
