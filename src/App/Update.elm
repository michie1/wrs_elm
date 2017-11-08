module App.Update exposing (update)

import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Routing
import App.Page
import App.UrlUpdate
import App.Helpers
import Data.Outfit as Outfit exposing (Outfit)
import Data.Race exposing (Race, racesDecoder)
import Data.RaceResult exposing (resultDecoder, resultsDecoder)
import Data.Rider exposing (ridersDecoder)
import Page.Rider.Add.Model as RiderAdd
import Page.Rider.Add.Update
import Page.Race.Add.Model as RaceAdd
import Page.Race.Add.Update
import Page.Result.Add.Model as ResultAdd
import Page.Result.Add.Update
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
                        Page.Race.Add.Update.addSubmit raceAdd app

                    _ ->
                        noOp

            RaceName name ->
                let
                    page =
                        Page.Race.Add.Update.addPage msg app.page
                in
                    ( { app | page = page }, Cmd.none )

            RaceAddRaceType raceType ->
                let
                    page =
                        Page.Race.Add.Update.addPage msg app.page
                in
                    ( { app | page = page }, Cmd.none )

            RaceDate newDate ->
                let
                    page =
                        Page.Race.Add.Update.addPage msg app.page
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
                case Json.Decode.decodeValue racesDecoder json of
                    Ok races ->
                        ( { app | races = Just races }, Cmd.none )

                    _ ->
                        ( app, Cmd.none )

            ResultAddSubmit ->
                Page.Result.Add.Update.addSubmit app

            ResultsJson rawResponse ->
                let
                    nextResults =
                        Json.Decode.decodeValue resultsDecoder rawResponse
                in
                    case nextResults of
                        Ok results ->
                            ( { app | results = Just results }
                            , Cmd.none
                            )

                        Err err ->
                            ( app, Cmd.none )

            ResultAddedJson rawResponse ->
                let
                    resultResult =
                        Json.Decode.decodeValue resultDecoder rawResponse
                in
                    case resultResult of
                        Ok result ->
                            ( app, App.Helpers.navigate (App.Page.RaceDetails result.raceKey) )

                        Err err ->
                            ( app, Cmd.none )

            ResultAddOutfit outfit ->
                Page.Result.Add.Update.addOutfit outfit app

            ResultAddCategory category ->
                ( (case app.page of
                    App.Page.ResultAdd resultAdd ->
                        { app
                            | page =
                                App.Page.ResultAdd <| Page.Result.Add.Update.addCategory category resultAdd
                        }

                    _ ->
                        app
                  )
                , Cmd.none
                )

            ResultAddResult value ->
                Page.Result.Add.Update.addResult value app

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

            RidersJson rawResponse ->
                let
                    nextRidersResult =
                        Json.Decode.decodeValue ridersDecoder rawResponse
                in
                    case nextRidersResult of
                        Ok riders ->
                            ( { app | riders = Just riders }
                            , Cmd.none
                            )

                        _ ->
                            ( app, Cmd.none )

            RiderAddSubmit ->
                Page.Rider.Add.Update.addSubmit app

            RiderAddName name ->
                Page.Rider.Add.Update.addName name app

            RiderAddLicence licence ->
                Page.Rider.Add.Update.addLicence licence app

            Noop ->
                noOp

            UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            NavigateTo page ->
                ( app, App.Helpers.navigate page )
