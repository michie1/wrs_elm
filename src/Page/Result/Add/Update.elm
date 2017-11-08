port module Page.Result.Add.Update exposing (addCategory, addResult, addSubmit, addOutfit)

import Json.Encode
import Set
import Ui.Chooser
import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Page
import App.UrlUpdate
import Page.Result.Add.Model exposing (Model)
import Page.Rider.Model
import Data.Outfit as Outfit exposing (Outfit, outfitToString)
import Data.RaceResult exposing (RaceResult, resultDecoder, resultsDecoder)
import Data.ResultCategory as ResultCategory exposing (ResultCategory, categoryToString)


port addResultPort : Json.Encode.Value -> Cmd msg


addCategory :
    ResultCategory
    -> Model
    -> Model
addCategory category resultAdd =
    { resultAdd | category = category }


addOutfit : Outfit -> App -> ( App, Cmd Msg )
addOutfit outfit app =
    case app.page of
        App.Page.ResultAdd resultAdd ->
            let
                nextAdd =
                    { resultAdd | outfit = outfit }

                nextApp =
                    { app | page = App.Page.ResultAdd nextAdd }
            in
                ( nextApp, Cmd.none )

        _ ->
            ( app, Cmd.none )


addResult : String -> App -> ( App, Cmd Msg )
addResult value app =
    case app.page of
        App.Page.ResultAdd raceKey ->
            ( { app | page = App.Page.ResultAdd raceKey }, Cmd.none )

        _ ->
            ( app, Cmd.none )


addSubmit : App -> ( App, Cmd Msg )
addSubmit app =
    case app.page of
        App.Page.ResultAdd add ->
            let
                payload =
                    Json.Encode.object
                        [ ( "raceKey", Json.Encode.string add.raceKey )
                        , ( "riderKey", Json.Encode.string (riderKey add.chooser) )
                        , ( "result", Json.Encode.string add.result )
                        , ( "category", Json.Encode.string <| categoryToString add.category )
                        , ( "outfit", Json.Encode.string <| outfitToString add.outfit )
                        ]
            in
                ( app, addResultPort payload )

        _ ->
            ( app, Cmd.none )


riderKey : Ui.Chooser.Model -> String
riderKey chooser =
    chooser.selected
        |> Set.toList
        |> List.head
        |> Maybe.withDefault ""
