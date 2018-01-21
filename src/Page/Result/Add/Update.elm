module Page.Result.Add.Update exposing (update)

import Json.Encode
import Set
import App.Model exposing (App)
import App.Page
import App.OutsideInfo exposing (sendInfoOutside)
import Page.Result.Add.Msg as Msg exposing (Msg)
import Page.Result.Add.Model exposing (Model)
import Data.Outfit exposing (outfitToString)
import Data.ResultCategory exposing (categoryToString)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg page =
    case msg of
        Msg.Submit ->
            case page.riderKey of
                Just riderKey ->
                    let
                        payload =
                            Json.Encode.object
                                [ ( "raceKey", Json.Encode.string page.raceKey )
                                , ( "riderKey", Json.Encode.string (Maybe.withDefault "" page.riderKey) )
                                , ( "result", Json.Encode.string page.result )
                                , ( "category", Json.Encode.string <| categoryToString page.category )
                                , ( "outfit", Json.Encode.string <| outfitToString page.outfit )
                                ]
                    in
                        ( page, sendInfoOutside <| App.OutsideInfo.ResultAdd payload )
                Nothing ->
                    ( page, Cmd.none )

        Msg.Outfit outfit ->
            let
                nextPage =
                        { page | outfit = outfit }
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

        Msg.Result result ->
            let
                nextPage =
                        { page | result = result }
            in
                ( nextPage
                , Cmd.none
                )

        Msg.Rider riderKey ->
            let
                nextPage =
                    if String.isEmpty riderKey then
                            { page | riderKey = Nothing }
                    else
                            { page | riderKey = Just riderKey }
            in
                ( nextPage
                , Cmd.none 
                )

     
