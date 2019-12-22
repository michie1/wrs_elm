module Page.Result.Edit.Update exposing (update)

import App.OutsideInfo exposing (sendInfoOutside)
import Data.ResultCategory exposing (categoryToString)
import Json.Encode
import Page.Result.Edit.Model exposing (Model)
import Page.Result.Edit.Msg as Msg exposing (Msg)


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
                        , ( "category", Json.Encode.string <| categoryToString page.category )
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

        Msg.Category category ->
            let
                nextPage =
                    { page | category = category }
            in
            ( nextPage
            , Cmd.none
            )
