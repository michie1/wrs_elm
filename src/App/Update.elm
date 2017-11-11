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
import Page.Rider.Add.Update as RiderAdd
import Page.Race.Add.Model as RaceAdd
import Page.Race.Add.Update as RaceAdd
import Page.Result.Add.Model as ResultAdd
import Page.Result.Add.Update as ResultAdd
import String
import Json.Decode
import Json.Decode.Pipeline


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
            ResultAddMsg subMsg ->
                let
                    ( nextApp, nextCmd ) =
                        ResultAdd.update subMsg app
                in
                    ( nextApp, Cmd.map ResultAddMsg nextCmd )

            ResultAddedJson rawResponse ->
                let
                    resultResult =
                        Json.Decode.decodeValue resultDecoder rawResponse
                in
                    case resultResult of
                        Ok result ->
                            ( app, (App.Helpers.navigate (App.Page.RaceDetails result.raceKey)) )

                        Err err ->
                            ( app, Cmd.none )

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

            RaceAddMsg subMsg ->
                let
                    ( nextApp, nextCmd ) =
                        RaceAdd.update subMsg app
                in
                    ( nextApp, Cmd.map RaceAddMsg nextCmd )

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

            RiderAddMsg subMsg ->
                let
                    ( nextApp, nextCmd ) =
                        RiderAdd.update subMsg app
                in
                    ( nextApp, Cmd.map RiderAddMsg nextCmd )

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

            Noop ->
                noOp

            UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            NavigateTo page ->
                ( app, App.Helpers.navigate page )
