port module Account.Update exposing (logout, logoutSubmit, loginSubmit, login, loginEmail, loginPassword, signup, settingsLicence)

import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Helpers
import Task
import Rider.Model
import Json.Encode
import Json.Decode
import App.Encoder
import App.Routing
import Account.Model

port accountLogin : Account.Model.Login -> Cmd msg
port accountLogout : String -> Cmd msg


loginEmail : String -> App -> ( App, Cmd Msg )
loginEmail email app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                nextAccountLogin =
                    { accountLogin | email = email }
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


logoutSubmit : App -> ( App, Cmd Msg )
logoutSubmit app =
    case app.account of
        Just account ->
            ( app, accountLogout "logout" )

        Nothing ->
            ( app, Cmd.none )

logout : String -> App -> ( App, Cmd Msg )
logout message app =
    ( { app | account = Nothing }
    , App.Helpers.navigate <| App.Routing.Home
    )

login : String -> App -> ( App, Cmd Msg )
login email app =
    let
        nextAccount =
            case app.account of
                Just account ->
                    { account | email = email }
                Nothing ->
                    Account.Model.Account 1 email "" Nothing
    in
        ( { app | account = Just nextAccount }
        , App.Helpers.navigate <| App.Routing.Home
        )

loginSubmit : App -> ( App, Cmd Msg )
loginSubmit app =
    case app.page of
        App.Model.AccountLogin form ->
            ( app
            , accountLogin form
            )
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
                        accountSignup.email
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
