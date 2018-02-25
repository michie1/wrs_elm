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
            ( page, Cmd.none )
            {--
            case page.riderKey of
                Just riderKey ->
                    let
                        payload =
                            Json.Encode.object
                                [ ( "raceKey", Json.Encode.string page.raceKey )
                                , ( "riderKey", Json.Encode.string riderKey )
                                , ( "result", Json.Encode.string page.result )
                                , ( "category", Json.Encode.string <| categoryToString page.category )
                                , ( "outfit", Json.Encode.string <| outfitToString page.outfit )
                                ]
                    in
                        ( page, sendInfoOutside <| App.OutsideInfo.ResultAdd payload )

                Nothing ->
                    ( page, Cmd.none )
            --}


        Msg.Result result ->
            let
                nextPage =
                    { page | result = result }
            in
                ( nextPage
                , Cmd.none
                )
