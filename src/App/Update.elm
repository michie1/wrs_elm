module App.Update exposing (update)

import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Routing
import App.Page
import App.UrlUpdate
import App.Helpers
import Data.Outfit as Outfit exposing (Outfit)
import Data.Race exposing (Race)
import Race.Update
import Rider.Model
import Rider.Update
import Result.Model
import Result.Update
import String
import Json.Encode
import Json.Decode
import Json.Decode.Pipeline
import Ui.Calendar
import Ui.Chooser


type alias KeyResponse =
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

            RaceName name ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    ( { app | page = page }, Cmd.none )

            RaceAddRaceType raceType ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    ( { app | page = page }, Cmd.none )

            RaceDate newDate ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    ( { app | page = page }, Cmd.none )

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

            RaceAddedJson rawResponse ->
                let
                    decoder =
                        Json.Decode.Pipeline.decode
                            KeyResponse
                            |> Json.Decode.Pipeline.required "key" Json.Decode.string

                    keyResponseResult =
                        Json.Decode.decodeValue decoder rawResponse
                in
                    case keyResponseResult of
                        Ok keyResponse ->
                            ( app
                            , App.Helpers.navigate (App.Page.RaceDetails keyResponse.key)
                            )

                        Err err ->
                            noOp

            RacesJson json ->
                Race.Update.racesJson json app

            ResultAddSubmit ->
                Result.Update.addSubmit app

            ResultsJson rawResponse ->
                Result.Update.resultsJson rawResponse app

            ResultAddedJson rawResponse ->
                Result.Update.addedJson rawResponse app

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

            RiderAddedJson rawResponse ->
                let
                    decoder =
                        Json.Decode.Pipeline.decode
                            KeyResponse
                            |> Json.Decode.Pipeline.required "key" Json.Decode.string

                    keyResponseResult =
                        Json.Decode.decodeValue decoder rawResponse
                in
                    case keyResponseResult of
                        Ok keyResponse ->
                            ( app
                            , App.Helpers.navigate (App.Page.RiderDetails keyResponse.key)
                            )

                        Err err ->
                            noOp

            RidersJson json ->
                Rider.Update.ridersJson json app

            RiderAddSubmit ->
                Rider.Update.addSubmit app

            RiderAddName name ->
                Rider.Update.addName name app

            RiderAddLicence licence ->
                Rider.Update.addLicence licence app

            Noop ->
                noOp

            UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            NavigateTo page ->
                ( app, App.Helpers.navigate page )
