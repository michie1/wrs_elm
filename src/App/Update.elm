port module App.Update exposing (update)

import App.Model exposing (App)
import App.Routing
import App.Decoder
import App.Encoder
import App.Msg exposing (Msg(..))
import App.UrlUpdate
import Race.Model exposing (Race)
import Rider.Model
import Result.Model
import Result.Update
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
import Json.Encode
import Json.Decode
import App.Helpers
import Rider.Update
import Ui.Ratings
import Ui.Calendar
import Ui.Chooser
import Navigation
import Json.Decode.Pipeline
import Json.Decode


port setLocalStorage : ( String, String ) -> Cmd msg
port getLocalStorage : String -> Cmd msg

type alias RaceResponse =
    { key : String
    }

update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    let
        noOp =
            ( app, Cmd.none )
    in
        case msg of
            RaceAddSubmit ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        Race.Update.addSubmit raceAdd app
                    _ ->
                        noOp

            RaceAdd ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        noOp

                    _ ->
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

            RacesJson json ->
                Race.Update.racesJson json app

            ResultsJson json ->
                Result.Update.resultsJson json app

            ResultAdd ->
                case app.page of
                    App.Model.ResultAdd resultAdd ->
                        case app.riders of
                            Just riders ->
                                -- case Result.Update.add resultAdd riders app.results
                                noOp

                            Nothing ->
                                noOp

                    _ ->
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

            UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            NavigateTo route ->
                ( app, App.Helpers.navigate route )

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

            RaceAddedJson rawResponse ->
                let
                    decoder =
                        Json.Decode.Pipeline.decode
                            RaceResponse
                            |> Json.Decode.Pipeline.required "key" Json.Decode.string

                    raceResult =
                        Json.Decode.decodeValue decoder rawResponse

                in
                    case raceResult of
                        Ok race ->
                            let
                                _ = Debug.log "raceKey" race.key
                            in
                                ( app
                                , App.Helpers.navigate (App.Routing.RaceDetails race.key)
                                )

                        Err err ->
                            let
                                _ = Debug.log "hoi" err
                            in
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
                                        result.raceKey
                                        result.result
                                        Result.Model.CatA
                                        --result.strava
                            in
                                ( { app | results = newResult :: app.results }
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
                            in
                                ( { app
                                    | riders = Just riders
                                  }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            Noop ->
                noOp

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

            RidersJson json ->
                Rider.Update.ridersJson json app

            RiderAddSubmit ->
                Rider.Update.addSubmit app

            RiderAddName name ->
                Rider.Update.addName name app

            RiderAddLicence licence ->
                Rider.Update.addLicence licence app

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

            Ratings msg_ ->
                let
                    ( ratings, cmd ) =
                        Ui.Ratings.update msg_ app.ratings
                in
                    ( { app | ratings = ratings }
                    , Cmd.map Ratings cmd
                    )

            Calendar msg_ ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        let
                            ( calendar, cmd ) =
                                Ui.Calendar.update msg_ raceAdd.calendar

                            nextRaceAdd =
                                App.Model.RaceAdd { raceAdd | calendar = calendar }
                        in
                            ( { app | page = nextRaceAdd }
                            , Cmd.map Calendar cmd
                            )

                    _ ->
                        noOp

            Chooser msg_ ->
                case app.page of
                    App.Model.ResultAdd resultAdd ->
                        let
                            ( chooser, cmd ) =
                                Ui.Chooser.update msg_ resultAdd.chooser

                            nextResultAdd =
                                App.Model.ResultAdd { resultAdd | chooser = chooser }
                        in
                            ( { app | page = nextResultAdd }
                            , Cmd.map Chooser cmd
                            )

                    _ ->
                        noOp
