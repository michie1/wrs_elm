module App.Update exposing (update)

import App.Model exposing (App)
import App.Msg as Msg exposing (Msg)
import App.Routing
import App.Page
import App.UrlUpdate
import App.Helpers
import App.OutsideInfo
import Data.Race exposing (Race, racesDecoder)
import Data.RaceResult exposing (resultDecoder, resultsDecoder)
import Data.Rider exposing (ridersDecoder)
import Data.Outfit as Outfit exposing (Outfit)
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
            Msg.ResultAdd subMsg ->
                let
                    ( nextApp, nextCmd ) =
                        ResultAdd.update subMsg app
                in
                    ( nextApp, Cmd.map Msg.ResultAdd nextCmd )

            Msg.ResultAddedJson rawResponse ->
                let
                    resultResult =
                        Json.Decode.decodeValue resultDecoder rawResponse
                in
                    case resultResult of
                        Ok result ->
                            ( app, App.Helpers.navigate <| App.Page.RaceDetails result.raceKey )

                        Err err ->
                            ( app, Cmd.none )

            Msg.ResultsJson rawResponse ->
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

            Msg.RaceAdd subMsg ->
                let
                    ( nextApp, nextCmd ) =
                        RaceAdd.update subMsg app
                in
                    ( nextApp, Cmd.map Msg.RaceAdd nextCmd )

            Msg.RaceAddedJson rawResponse ->
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
                            ( app, App.Helpers.navigate <| App.Page.RaceDetails keyResponse.key )

                        Err err ->
                            noOp

            Msg.RacesJson json ->
                case Json.Decode.decodeValue racesDecoder json of
                    Ok races ->
                        ( { app | races = Just races }, Cmd.none )

                    _ ->
                        ( app, Cmd.none )

            Msg.RiderAdd subMsg ->
                let
                    ( nextApp, nextCmd ) =
                        RiderAdd.update subMsg app
                in
                    ( nextApp, Cmd.map Msg.RiderAdd nextCmd )

            Msg.RiderAddedJson rawResponse ->
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
                            ( app, App.Helpers.navigate <| App.Page.RiderDetails keyResponse.key )

                        Err err ->
                            noOp

            Msg.Noop ->
                noOp

            Msg.UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            Msg.NavigateTo page ->
                ( app, App.Helpers.navigate page )

            Msg.Outside infoForElm ->
                case infoForElm of
                    App.OutsideInfo.RidersLoaded riders ->
                        ( { app | riders = Just riders }, Cmd.none )

            Msg.LogErr err ->
                ( app, App.OutsideInfo.sendInfoOutside (App.OutsideInfo.LogError err) )
