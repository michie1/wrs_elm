module Result.Update exposing (addCategory, addResult, resultsJson)
import Json.Decode.Pipeline

import App.Model exposing (App)
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


addCategory :
    Result.Model.ResultCategory
    -> Result.Model.Add
    -> Result.Model.Add
addCategory category resultAdd =
    { resultAdd | category = category }


addResult : String -> Result.Model.Add -> Result.Model.Add
addResult value resultAdd =
    { resultAdd | result = value }

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
        |> Json.Decode.Pipeline.required "id" Json.Decode.int
        |> Json.Decode.Pipeline.required "rider" Json.Decode.string
        |> Json.Decode.Pipeline.required "race" Json.Decode.string
        |> Json.Decode.Pipeline.required "result" Json.Decode.string
        |> Json.Decode.Pipeline.required "category"
            (Json.Decode.string
                |> Json.Decode.andThen resultCategoryDecoder
            )

resultsDecoder : Json.Decode.Decoder (List Result.Model.Result)
resultsDecoder =
    Json.Decode.list resultDecoder

resultsJson : Json.Decode.Value -> App -> ( App, Cmd Msg )
resultsJson json app =
    let
        nextResults = Debug.log "results" (Json.Decode.decodeValue resultsDecoder json)
    in
        case nextResults of
            Ok results ->
                ( { app | results = results }
                , Cmd.none
                )
            _ ->
                ( app, Cmd.none )
