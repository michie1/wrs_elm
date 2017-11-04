port module Page.Rider.Update exposing (..)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Page
import Json.Decode
import Json.Encode
import App.Routing
import App.UrlUpdate
import Page.Rider.Model
import Data.Licence as Licence exposing (Licence)
import Data.Rider exposing (Rider)

port addRider : (Json.Encode.Value) -> Cmd msg

licence : String -> Licence
licence string =
    case string of
        "elite" ->
            Licence.Elite

        "amateurs" ->
            Licence.Amateurs

        "basislidmaatschap" ->
            Licence.Basislidmaatschap

        _ ->
            Licence.Other

licenceDecoder : String -> Json.Decode.Decoder Licence
licenceDecoder string =
    Json.Decode.succeed (licence string)

rider : Json.Decode.Decoder Rider
rider =
    Json.Decode.map3
        Rider
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "licence"
            (Json.Decode.andThen licenceDecoder Json.Decode.string)
        )

ridersDecoder : Json.Decode.Decoder (List Rider)
ridersDecoder =
    Json.Decode.list rider

ridersJson : Json.Decode.Value -> App -> ( App, Cmd Msg )
ridersJson json app =
    let
        nextRidersResult = Json.Decode.decodeValue ridersDecoder json
    in
        case nextRidersResult of
            Ok riders ->
                ( { app | riders = Just riders }
                , Cmd.none
                )
            _ ->
                ( app, Cmd.none )



addSubmit : App -> ( App, Cmd Msg)
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

licenceToString : Maybe Licence -> String
licenceToString maybeLicence =
    case maybeLicence of
        Just Licence.Elite ->
            "elite"

        Just Licence.Amateurs ->
            "amateurs"

        Just Licence.Basislidmaatschap ->
            "basislidmaatschap"

        Just Licence.Other ->
            "other"

        Nothing ->
            "other"


addName : String -> App -> ( App, Cmd Msg )
addName name app =
    let
        page =
            case app.page of
                App.Page.RiderAdd riderAdd ->
                    App.Page.RiderAdd { riderAdd | name = name }
                _ ->
                    app.page
        nextApp = { app | page = page }
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
        nextApp = { app | page = page }
    in
        ( nextApp, Cmd.none )
