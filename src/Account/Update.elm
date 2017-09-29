module Account.Update exposing (logout, login, loginName, loginPassword, signup, settingsLicence)

import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Helpers
import Task
import Rider.Model
import Json.Encode
import Json.Decode
import App.Encoder
import App.Routing


loginName : String -> App -> ( App, Cmd Msg )
loginName name app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                nextAccountLogin =
                    { accountLogin | name = name }
            in
                ( { app | page = App.Model.AccountLogin nextAccountLogin }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


loginPassword : String -> App -> ( App, Cmd Msg )
loginPassword password app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                nextAccountLogin =
                    { accountLogin | password = password }
            in
                ( { app | page = App.Model.AccountLogin nextAccountLogin }
                , Cmd.none
                )

        _ ->
            ( app, Cmd.none )


logout : App -> ( App, Cmd Msg )
logout app =
    case app.account of
        Just account ->
            ( { app | account = Nothing }
            , App.Helpers.navigate <| App.Routing.Home
            )

        Nothing ->
            ( app, Cmd.none )


login : App -> ( App, Cmd Msg )
login app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                maybeRider =
                    App.Helpers.getRiderByLowerCaseName
                        accountLogin.name
                        (Maybe.withDefault [] app.riders)
            in
                case maybeRider of
                    Just rider ->
                        ( { app | account = maybeRider }
                        , App.Helpers.navigate App.Routing.Home
                        )

                    Nothing ->
                        ( app, Cmd.none )

        _ ->
            ( app, Cmd.none )


signup : App -> ( App, Cmd Msg )
signup app =
    case app.page of
        App.Model.AccountSignup accountSignup ->
            -- TODO do not add directly, but send websocket to add new rider
            let
                newRider =
                    Rider.Model.Rider
                        ((List.length (Maybe.withDefault [] app.riders)) + 1)
                        accountSignup.name
                        Nothing
            in
                ( app
                , Cmd.batch []
                )

        _ ->
            ( app, Cmd.none )



settingsLicence : Rider.Model.Licence -> App -> ( App, Cmd Msg )
settingsLicence licence app =
    case app.account of
        Just account ->
            let
                nextAccount =
                    { account | licence = Just licence }
            in
                ( { app | account = Just nextAccount }
                , Cmd.batch []
                )

        Nothing ->
            ( app, Cmd.none )


