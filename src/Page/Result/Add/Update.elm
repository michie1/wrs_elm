module Page.Result.Add.Update exposing (update)

import Json.Encode
import Set
import Ui.Chooser
import Json.Decode
import App.Model exposing (App)
import App.Page
import App.UrlUpdate
import App.Helpers
import App.OutsideInfo exposing (sendInfoOutside, InfoForOutside)
import Page.Result.Add.Model exposing (Model)
import Page.Result.Add.Msg as Msg exposing (Msg)
import Data.Outfit as Outfit exposing (Outfit, outfitToString)
import Data.RaceResult exposing (RaceResult, resultDecoder, resultsDecoder)
import Data.ResultCategory as ResultCategory exposing (ResultCategory, categoryToString)


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
                                , ( "riderKey", Json.Encode.string (riderKey page.chooser) )
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

                Msg.Chooser msg_ ->
                    let
                        ( chooser, cmd ) =
                            Ui.Chooser.update msg_ page.chooser

                        nextPage =
                            App.Page.ResultAdd
                                { page | chooser = chooser }
                    in
                        ( { app | page = nextPage }
                        , Cmd.map Msg.Chooser cmd
                        )

        _ ->
            ( app, Cmd.none )


riderKey : Ui.Chooser.Model -> String
riderKey chooser =
    chooser.selected
        |> Set.toList
        |> List.head
        |> Maybe.withDefault ""
