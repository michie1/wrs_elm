module Page.Result.Edit.Update exposing (update)

import Json.Encode
import App.OutsideInfo exposing (sendInfoOutside)
import Page.Result.Edit.Msg as Msg exposing (Msg)
import Page.Result.Edit.Model exposing (Model)
import Data.Outfit exposing (outfitToString)
import Data.ResultCategory exposing (categoryToString)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg page =
    case msg of
        Msg.Submit ->
            let
                payload =
                    Json.Encode.object
                        [ ( "key", Json.Encode.string page.resultKey )
                        , ( "raceKey", Json.Encode.string page.raceKey )
                        , ( "result", Json.Encode.string page.result )
                        ]
            in
                ( page, sendInfoOutside <| App.OutsideInfo.ResultEdit payload )




        Msg.Result result ->
            let
                nextPage =
                    { page | result = result }
            in
                ( nextPage
                , Cmd.none
                )
