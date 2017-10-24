port module Rider.Update exposing (..)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Page
import Json.Decode
import Json.Encode
import App.Decoder
import App.Encoder
import App.Routing
import App.UrlUpdate
import Rider.Model

port addRider : (Json.Encode.Value) -> Cmd msg

licence : String -> Maybe Rider.Model.Licence
licence string =
    case string of
        "elite" ->
            Just Rider.Model.Elite

        "amateurs" ->
            Just Rider.Model.Amateurs

        "basislidmaatschap" ->
            Just Rider.Model.Basislidmaatschap

        _ ->
            Nothing

licenceDecoder : String -> Json.Decode.Decoder (Maybe Rider.Model.Licence)
licenceDecoder string =
    Json.Decode.succeed (licence string)

rider : Json.Decode.Decoder Rider.Model.Rider
rider =
    Json.Decode.map3
        Rider.Model.Rider
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "licence"
            (Json.Decode.andThen licenceDecoder Json.Decode.string)
        )

ridersDecoder : Json.Decode.Decoder (List Rider.Model.Rider)
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
                        , ( "licence", App.Encoder.licence add.licence )
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
        nextApp = { app | page = page }
    in
        ( nextApp, Cmd.none )


addLicence : Rider.Model.Licence -> App -> ( App, Cmd Msg )
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
