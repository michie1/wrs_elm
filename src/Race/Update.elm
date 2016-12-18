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

add : App -> ( App, Cmd Msg )
add app =
    case app.raceAdd of
        Just raceAdd ->
            case raceAdd.name /= "" of
                True ->
                    case app.races of
                        Just races ->
                            let
                                newRace =
                                    Race.Model.Race
                                        (App.Helpers.calcRaceId races)
                                        raceAdd.name
                                        raceAdd.dateString
                                        raceAdd.category
                            in
                                ( { app | races = Just (newRace :: races) }
                                , App.Helpers.navigate <| App.Routing.RaceDetails newRace.id
                                )

                        Nothing ->
                            ( app, Cmd.none )

                False ->
                    ( app, Cmd.none )

        Nothing ->
            ( app, Cmd.none )


addName : String -> App -> ( App, Cmd Msg )
addName newName app =
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


addCategory : Race.Model.Category -> App -> ( App, Cmd Msg )
addCategory category app =
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


addDate : String -> App -> ( App, Cmd Msg )
addDate newDate app =
    case app.raceAdd of
        Just raceAdd ->
            let
                newRaceAdd =
                    --{ raceAdd | dateString = Just newDate }
                    { raceAdd | dateString = newDate }
            in
                ( { app
                    | raceAdd = Just newRaceAdd
                  }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


addSet : Maybe Date.Date -> App -> ( App, Cmd Msg )
addSet maybeNow app =
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
                      --| dateString = Just dateFormatted
                        | dateString = dateFormatted
                    }
            in
                ( { app | raceAdd = Just raceAdd }
                , Cmd.none
                )

        Nothing ->
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
                    --{ raceAdd | dateString = Just dateFormatted }
                    { raceAdd | dateString = dateFormatted }
            in
                ( { app | raceAdd = Just newRaceAdd }
                , Cmd.none
                )

        Nothing ->
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
                    --{ raceAdd | dateString = Just dateFormatted }
                    { raceAdd | dateString = dateFormatted }
            in
                ( { app | raceAdd = Just newRaceAdd }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )

racesSocket : App -> ( App, Cmd Msg )
racesSocket app =
    let
        _ = Debug.log "races" "socket"
        payload = Json.Encode.object [ ( "name", Json.Encode.string "hoi" ) ]

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
