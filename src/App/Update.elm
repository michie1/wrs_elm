module App.Update exposing (update)

import App.Model exposing (App)
import App.Msg as Msg exposing (Msg)
import App.Page
import App.UrlUpdate
import App.Helpers
import App.OutsideInfo
import Page.Rider.Add.Update as RiderAdd
import Page.Race.Add.Update as RaceAdd
import Page.Result.Add.Update as ResultAdd
import Page.Result.Edit.Update as ResultEdit


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case msg of
        Msg.Navigate page ->
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

                App.OutsideInfo.UserLoaded email ->
                    ( { app | user = Just { email = email } }, Cmd.none )

        Msg.LogErr err ->
            ( app, App.OutsideInfo.sendInfoOutside <| App.OutsideInfo.LogError err )

        Msg.RaceAdd subMsg ->
            case app.page of
                App.Page.RaceAdd page ->
                    let
                        ( nextPage, nextCmd ) =
                            RaceAdd.update subMsg page
                    in
                        ( { app | page = App.Page.RaceAdd nextPage }, Cmd.map Msg.RaceAdd nextCmd )

                _ ->
                    ( app, Cmd.none )

        Msg.RiderAdd subMsg ->
            case app.page of
                App.Page.RiderAdd page ->
                    let
                        ( nextPage, nextCmd ) =
                            RiderAdd.update subMsg page
                    in
                        ( { app | page = App.Page.RiderAdd nextPage }, Cmd.map Msg.RiderAdd nextCmd )

                _ ->
                    ( app, Cmd.none )

        Msg.ResultAdd subMsg ->
            case app.page of
                App.Page.ResultAdd page ->
                    let
                        ( nextPage, nextCmd ) =
                            ResultAdd.update subMsg page
                    in
                        ( { app | page = App.Page.ResultAdd nextPage }
                        , Cmd.map Msg.ResultAdd nextCmd
                        )

                _ ->
                    ( app, Cmd.none )

        Msg.ResultEdit subMsg ->
            case app.page of
                App.Page.ResultEdit page ->
                    let
                        ( nextPage, nextCmd ) =
                            ResultEdit.update subMsg page
                    in
                        ( { app | page = App.Page.ResultEdit nextPage }
                        , Cmd.map Msg.ResultEdit nextCmd
                        )

                _ ->
                    ( app, Cmd.none )

