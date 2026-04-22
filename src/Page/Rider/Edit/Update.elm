module Page.Rider.Edit.Update exposing (update)

import App.OutsideInfo exposing (sendInfoOutside)
import Data.Licence exposing (licenceToString)
import Json.Encode
import Page.Rider.Edit.Model exposing (Model)
import Page.Rider.Edit.Msg as Msg exposing (Msg)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg page =
    case msg of
        Msg.Submit ->
            let
                payload =
                    Json.Encode.object
                        [ ( "key", Json.Encode.string page.riderKey )
                        , ( "licence", Json.Encode.string <| licenceToString page.licence )
                        ]
            in
            ( page, sendInfoOutside <| App.OutsideInfo.RiderEdit payload )

        Msg.Licence licence ->
            ( { page | licence = licence }, Cmd.none )
