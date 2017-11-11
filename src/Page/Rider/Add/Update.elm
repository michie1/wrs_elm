port module Page.Rider.Add.Update exposing (update)

import App.Model exposing (App)
import App.Page
import Json.Decode
import Json.Encode
import App.Routing
import App.UrlUpdate
import Page.Rider.Add.Model exposing (Model)
import Page.Rider.Add.Msg as Msg exposing (Msg)
import Data.Licence as Licence exposing (Licence, licenceToString)
import Data.Rider exposing (Rider)


port addRider : Json.Encode.Value -> Cmd msg

update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case msg of
        Msg.Submit ->
            addSubmit app

        Msg.Name name ->
            addName name app

        Msg.Licence licence ->
            addLicence licence app

addSubmit : App -> ( App, Cmd Msg )
addSubmit app =
    case app.page of
        App.Page.RiderAdd add ->
            let
                payload =
                    Json.Encode.object
                        [ ( "name", Json.Encode.string add.name )
                        , ( "licence", Json.Encode.string <| licenceToString add.licence )
                        ]
            in
                ( app, addRider payload )

        _ ->
            ( app, Cmd.none )


addName : String -> App -> ( App, Cmd Msg )
addName name app =
    let
        page =
            case app.page of
                App.Page.RiderAdd riderAdd ->
                    App.Page.RiderAdd { riderAdd | name = name }

                _ ->
                    app.page

        nextApp =
            { app | page = page }
    in
        ( nextApp, Cmd.none )


addLicence : Licence -> App -> ( App, Cmd Msg )
addLicence licence app =
    let
        page =
            case app.page of
                App.Page.RiderAdd riderAdd ->
                    App.Page.RiderAdd { riderAdd | licence = Just licence }

                _ ->
                    app.page

        nextApp =
            { app | page = page }
    in
        ( nextApp, Cmd.none )
