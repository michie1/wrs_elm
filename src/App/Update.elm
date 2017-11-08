module App.Update exposing (update)

import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Routing
import App.Page
import App.UrlUpdate
import App.Helpers
import Data.Outfit as Outfit exposing (Outfit)
import Data.Race exposing (Race)
import Page.Rider.Model
import Page.Rider.Update
import Page.Race.Add.Model
import Page.Race.Update
import Page.Result.Model
import Page.Result.Update
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
                        Page.Race.Update.addSubmit raceAdd app

                    _ ->
                        noOp

            RaceName name ->
                let
                    page =
                        Page.Race.Update.addPage2 msg app.page
                in
                    ( { app | page = page }, Cmd.none )

            RaceAddRaceType raceType ->
                let
                    page =
                        Page.Race.Update.addPage2 msg app.page
                in
                    ( { app | page = page }, Cmd.none )

            RaceDate newDate ->
                let
                    page =
                        Page.Race.Update.addPage2 msg app.page
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
                Page.Race.Update.racesJson json app

            ResultAddSubmit ->
                Page.Result.Update.addSubmit app

            ResultsJson rawResponse ->
                Page.Result.Update.resultsJson rawResponse app

            ResultAddedJson rawResponse ->
                Page.Result.Update.addedJson rawResponse app

            ResultAddOutfit outfit ->
                Page.Result.Update.addOutfit outfit app

            ResultAddCategory category ->
                ( (case app.page of
                    App.Page.ResultAdd resultAdd ->
                        { app
                            | page =
                                App.Page.ResultAdd <| Page.Result.Update.addCategory category resultAdd
                        }

                    _ ->
                        app
                  )
                , Cmd.none
                )

            ResultAddResult value ->
                Page.Result.Update.addResult value app

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
                Page.Rider.Update.ridersJson json app

            RiderAddSubmit ->
                Page.Rider.Update.addSubmit app

            RiderAddName name ->
                Page.Rider.Update.addName name app

            RiderAddLicence licence ->
                Page.Rider.Update.addLicence licence app

            Noop ->
                noOp

            UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            NavigateTo page ->
                ( app, App.Helpers.navigate page )
