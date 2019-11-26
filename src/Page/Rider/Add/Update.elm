module Page.Rider.Add.Update exposing (update)

import App.OutsideInfo exposing (sendInfoOutside)
import Data.Licence exposing (licenceToString)
import Json.Encode
import Page.Rider.Add.Model exposing (Model)
import Page.Rider.Add.Msg as Msg exposing (Msg)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg page =
    case msg of
        Msg.Submit ->
            case page.licence of
                Just licence ->
                    let
                        payload =
                            Json.Encode.object
                                [ ( "name", Json.Encode.string page.name )
                                , ( "licence", Json.Encode.string <| licenceToString licence )
                                ]
                    in
                    ( page, sendInfoOutside <| App.OutsideInfo.RiderAdd payload )

                Nothing ->
                    ( page, Cmd.none )

        Msg.Name name ->
            ( { page | name = name }, Cmd.none )

        Msg.Licence licence ->
            ( { page | licence = Just licence }, Cmd.none )
