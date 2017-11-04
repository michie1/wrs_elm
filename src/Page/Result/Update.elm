port module Page.Result.Update exposing (addCategory, addResult, addedJson, resultsJson, addSubmit, addOutfit)

import Json.Decode.Pipeline
import Json.Encode
import Json.Decode
import Set
import Ui.Chooser
import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import App.Page
import App.Routing
import App.UrlUpdate
import App.Helpers
import Page.Result.Model exposing (Add)
import Page.Rider.Model
import Page.Result.Helpers exposing (..)
import Data.Outfit as Outfit exposing (Outfit)
import Data.RaceResult exposing (RaceResult)
import Data.ResultCategory as ResultCategory exposing (ResultCategory)

port addResultPort : Json.Encode.Value -> Cmd msg


addCategory :
    ResultCategory
    -> Page.Result.Model.Add
    -> Page.Result.Model.Add
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


resultCategoryDecoder : String -> Json.Decode.Decoder ResultCategory
resultCategoryDecoder string =
    case string of
        "amateurs" ->
            Json.Decode.succeed ResultCategory.Amateurs

        "basislidmaatschap" ->
            Json.Decode.succeed ResultCategory.Basislidmaatschap

        "cata" ->
            Json.Decode.succeed ResultCategory.CatA

        "catb" ->
            Json.Decode.succeed ResultCategory.CatB

        "unknown" ->
            Json.Decode.succeed ResultCategory.Unknown

        _ ->
            Json.Decode.succeed ResultCategory.Unknown


resultDecoder : Json.Decode.Decoder RaceResult
resultDecoder =
    Json.Decode.Pipeline.decode RaceResult
        |> Json.Decode.Pipeline.required "key" Json.Decode.string
        |> Json.Decode.Pipeline.required "riderKey" Json.Decode.string
        |> Json.Decode.Pipeline.required "raceKey" Json.Decode.string
        |> Json.Decode.Pipeline.required "result" Json.Decode.string
        |> Json.Decode.Pipeline.required "category"
            (Json.Decode.string
                |> Json.Decode.andThen resultCategoryDecoder
            )
        |> Json.Decode.Pipeline.required "outfit"
            (Json.Decode.string
                |> Json.Decode.andThen resultOutfitDecoder
            )


resultOutfitDecoder : String -> Json.Decode.Decoder Outfit
resultOutfitDecoder string =
    Json.Decode.succeed <|
        case string of
            "wtos" ->
                Outfit.WTOS

            "wasp" ->
                Outfit.WASP

            "other" ->
                Outfit.Other

            _ ->
                Outfit.Other


resultsDecoder : Json.Decode.Decoder (List RaceResult)
resultsDecoder =
    Json.Decode.list resultDecoder


resultsJson : Json.Decode.Value -> App -> ( App, Cmd Msg )
resultsJson json app =
    let
        nextResults =
            Debug.log "results" (Json.Decode.decodeValue resultsDecoder json)
    in
        case nextResults of
            Ok results ->
                ( { app | results = Just results }
                , Cmd.none
                )

            Err err ->
                let
                    _ =
                        Debug.log "err" err
                in
                    ( app, Cmd.none )


addedJson : Json.Decode.Value -> App -> ( App, Cmd Msg )
addedJson rawResponse app =
    let
        resultResult =
            Json.Decode.decodeValue resultDecoder rawResponse
    in
        case resultResult of
            Ok result ->
                ( app, App.Helpers.navigate (App.Page.RaceDetails result.raceKey) )

            Err err ->
                let
                    _ =
                        Debug.log "err" err
                in
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


outfitToString : Outfit -> String
outfitToString outfit =
    case outfit of
        Outfit.WTOS ->
            "wtos"

        Outfit.WASP ->
            "wasp"

        Outfit.Other ->
            "other"


categoryToString : ResultCategory -> String
categoryToString category =
    case category of
        ResultCategory.Amateurs ->
            "amateurs"

        ResultCategory.Basislidmaatschap ->
            "basislidmaatschap"

        ResultCategory.CatA ->
            "cata"

        ResultCategory.CatB ->
            "catb"

        ResultCategory.Unknown ->
            "unknown"
