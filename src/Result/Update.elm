port module Result.Update exposing (addCategory, addResult, addedJson, resultsJson, addSubmit, addOutfit)

import Json.Decode.Pipeline
import App.Model exposing (App)
import App.Page
import Result.Model exposing (Add)
import Rider.Model
import App.Msg exposing (Msg(..))
import Result.Helpers exposing (..)
import App.Helpers
import App.Routing
import Json.Encode
import Json.Decode
import App.Encoder
import App.Decoder
import Set
import App.UrlUpdate
import Ui.Chooser
import App.Outfit exposing (Outfit)


port addResultPort : Json.Encode.Value -> Cmd msg


addCategory :
    Result.Model.ResultCategory
    -> Result.Model.Add
    -> Result.Model.Add
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
        App.Page.ResultAdd add ->
            let
                nextAdd =
                    { add | result = value }
            in
                ( { app | page = App.Page.ResultAdd nextAdd }, Cmd.none )

        _ ->
            ( app, Cmd.none )


resultCategoryDecoder : String -> Json.Decode.Decoder Result.Model.ResultCategory
resultCategoryDecoder string =
    case string of
        "amateurs" ->
            Json.Decode.succeed Result.Model.Amateurs

        "basislidmaatschap" ->
            Json.Decode.succeed Result.Model.Basislidmaatschap

        "cata" ->
            Json.Decode.succeed Result.Model.CatA

        "catb" ->
            Json.Decode.succeed Result.Model.CatB

        "unknown" ->
            Json.Decode.succeed Result.Model.Unknown

        _ ->
            Json.Decode.succeed Result.Model.Unknown


resultDecoder : Json.Decode.Decoder Result.Model.Result
resultDecoder =
    Json.Decode.Pipeline.decode Result.Model.Result
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
                |> Json.Decode.andThen App.Decoder.resultOutfitDecoder
            )


resultsDecoder : Json.Decode.Decoder (List Result.Model.Result)
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
                        , ( "category", App.Encoder.resultCategory add.category )
                        , ( "outfit", App.Encoder.resultOutfit add.outfit )
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



{--
    { raceKey : String
    , result : String
    , category : ResultCategory
    , strava : String
    , chooser : Ui.Chooser.Model
    }
--}
