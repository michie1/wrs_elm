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
    case msg of
        Msg.NavigateTo page ->
            ( app, App.Helpers.navigate page )

        Msg.UrlUpdate route ->
            App.UrlUpdate.urlUpdate route app

        Msg.Noop ->
            ( app, Cmd.none )

        Msg.Outside infoForElm ->
            case infoForElm of
                App.OutsideInfo.RidersLoaded riders ->
                    ( { app | riders = Just riders }, Cmd.none )

                App.OutsideInfo.RacesLoaded races ->
                    ( { app | races = Just races }, Cmd.none )

                App.OutsideInfo.ResultsLoaded results ->
                    ( { app | results = Just results }, Cmd.none )

                App.OutsideInfo.RaceAdded key ->
                    ( app, App.Helpers.navigate <| App.Page.RaceDetails key )

                App.OutsideInfo.RiderAdded key ->
                    ( app, App.Helpers.navigate <| App.Page.RiderDetails key )

                App.OutsideInfo.ResultAdded raceKey ->
                    ( app, App.Helpers.navigate <| App.Page.RaceDetails raceKey )

        Msg.LogErr err ->
            ( app, App.OutsideInfo.sendInfoOutside <| App.OutsideInfo.LogError err )

        Msg.RaceAdd subMsg ->
            let
                ( nextApp, nextCmd ) =
                    RaceAdd.update subMsg app
            in
                ( nextApp, Cmd.map Msg.RaceAdd nextCmd )

        Msg.RiderAdd subMsg ->
            let
                ( nextApp, nextCmd ) =
                    RiderAdd.update subMsg app
            in
                ( nextApp, Cmd.map Msg.RiderAdd nextCmd )

        Msg.ResultAdd subMsg ->
            let
                ( nextApp, nextCmd ) =
                    ResultAdd.update subMsg app
            in
                ( nextApp, Cmd.map Msg.ResultAdd nextCmd )
