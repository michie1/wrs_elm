module Account.Update exposing (loginName)

import App.Model exposing (App)
import App.Msg exposing (Msg(..))


loginName : App -> String -> ( App, Cmd Msg )
loginName app name =
    case app.accountLogin of
        Just accountLogin ->
            let
                nextAccountLogin =
                    { accountLogin | name = name }
            in
                ( { app | accountLogin = Just nextAccountLogin }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )
