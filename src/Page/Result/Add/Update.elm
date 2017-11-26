module Page.Result.Add.Update exposing (update)

import Json.Encode
import Set
import App.Model exposing (App)
import App.Page
import App.OutsideInfo exposing (sendInfoOutside)
import Page.Result.Add.Msg as Msg exposing (Msg)
import Data.Outfit exposing (outfitToString)
import Data.ResultCategory exposing (categoryToString)


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case app.page of
        App.Page.ResultAdd page ->
            case msg of
                Msg.Submit ->
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
                        ( app, sendInfoOutside <| App.OutsideInfo.ResultAdd payload )

                Msg.Outfit outfit ->
                    let
                        nextPage =
                            App.Page.ResultAdd
                                { page | outfit = outfit }
                    in
                        ( { app | page = nextPage }
                        , Cmd.none
                        )

                Msg.Category category ->
                    let
                        nextPage =
                            App.Page.ResultAdd
                                { page | category = category }
                    in
                        ( { app | page = nextPage }
                        , Cmd.none
                        )

                Msg.Result result ->
                    let
                        nextPage =
                            App.Page.ResultAdd
                                { page | result = result }
                    in
                        ( { app | page = nextPage }
                        , Cmd.none
                        )

                Msg.Rider riderKey ->
                    let
                        nextPage =
                            if String.isEmpty riderKey then
                                App.Page.ResultAdd
                                    { page | riderKey = Nothing }
                            else
                                App.Page.ResultAdd
                                    { page | riderKey = Just riderKey }
                    in
                        ( { app | page = nextPage }
                        , Cmd.none 
                        )

        _ ->
            ( app, Cmd.none )
