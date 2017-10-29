port module App.Update exposing (update)

import App.Model exposing (App)
import App.Routing
import App.Decoder
import App.Encoder
import App.Page
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
                    App.Page.RaceAdd raceAdd ->
                        Race.Update.addSubmit raceAdd app

                    _ ->
                        noOp

            RaceAdd ->
                case app.page of
                    App.Page.RaceAdd raceAdd ->
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

            ResultsJson rawResponse ->
                Result.Update.resultsJson rawResponse app

            ResultAddedJson rawResponse ->
                Result.Update.addedJson rawResponse app

            ResultAddSubmit ->
                Result.Update.addSubmit app

            ResultAddOutfit outfit ->
                Result.Update.addOutfit outfit app

            ResultAddCategory category ->
                ( (case app.page of
                    App.Page.ResultAdd resultAdd ->
                        { app
                            | page =
                                App.Page.ResultAdd <| Result.Update.addCategory category resultAdd
                        }

                    _ ->
                        app
                  )
                , Cmd.none
                )

            ResultAddResult value ->
                Result.Update.addResult value app

            UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            NavigateTo page ->
                ( app, App.Helpers.navigate page )

            RiderAddedJson rawResponse ->
                let
                    riderResult =
                        Json.Decode.decodeValue App.Decoder.riderDecoder (Debug.log "rawresponse" rawResponse)
                in
                    case riderResult of
                        Ok rider ->
                            let
                                newRider =
                                    Rider.Model.Rider
                                        rider.key
                                        rider.name
                                        rider.licence
                            in
                                ( { app | riders = Just (newRider :: (Maybe.withDefault [] app.riders)) }
                                , App.Helpers.navigate (App.Page.RiderDetails rider.key)
                                )

                        Err err ->
                            let
                                _ =
                                    Debug.log "err" err
                            in
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
                                _ =
                                    Debug.log "raceKey" race.key
                            in
                                ( app
                                , App.Helpers.navigate (App.Page.RaceDetails race.key)
                                )

                        Err err ->
                            let
                                _ =
                                    Debug.log "hoi" err
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
                                        result.key
                                        result.riderKey
                                        result.raceKey
                                        result.result
                                        Result.Model.CatA
                                        Result.Model.WTOS

                                --result.strava
                            in
                                ( { app | results = Just (newResult :: (Maybe.withDefault [] app.results)) }
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
                                        (App.Helpers.updateRiderLicence rider.key rider.licence (Maybe.withDefault [] app.riders))
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
                    App.Page.RaceAdd raceAdd ->
                        let
                            page =
                                Race.Update.addPage2 (App.Msg.RaceDate dateString) app.page

                            -- nextRaceAdd = { raceAdd | dateString = dateString }
                        in
                            ( { app | page = page }, Cmd.none )

                    _ ->
                        ( app, Cmd.none )

            Calendar msg_ ->
                case app.page of
                    App.Page.RaceAdd raceAdd ->
                        let
                            ( calendar, cmd ) =
                                Ui.Calendar.update msg_ raceAdd.calendar

                            nextRaceAdd =
                                App.Page.RaceAdd { raceAdd | calendar = calendar }
                        in
                            ( { app | page = nextRaceAdd }
                            , Cmd.map Calendar cmd
                            )

                    _ ->
                        noOp

            Chooser msg_ ->
                case app.page of
                    App.Page.ResultAdd resultAdd ->
                        let
                            ( chooser, cmd ) =
                                Ui.Chooser.update msg_ resultAdd.chooser

                            nextResultAdd =
                                App.Page.ResultAdd { resultAdd | chooser = chooser }
                        in
                            ( { app | page = nextResultAdd }
                            , Cmd.map Chooser cmd
                            )

                    _ ->
                        noOp
