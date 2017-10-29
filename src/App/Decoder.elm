module App.Decoder exposing (..)

import App.Model
import Race.Model
import Result.Model
import Rider.Model
import Json.Decode
import Json.Decode.Extra
import Json.Decode.Pipeline
import Date

import App.Outfit as Outfit exposing (Outfit)


decodeCategory : String -> Json.Decode.Decoder Race.Model.Category
decodeCategory string =
    Json.Decode.succeed (category string)


category : String -> Race.Model.Category
category string =
    case string of
        "Klassieker" ->
            Race.Model.Classic

        "Criterium" ->
            Race.Model.Criterium

        "Regiocross" ->
            Race.Model.Regiocross

        "Other" ->
            Race.Model.Other

        _ ->
            Race.Model.Unknown


decodeLicence : String -> Json.Decode.Decoder Rider.Model.Licence
decodeLicence string =
    Json.Decode.succeed (licence string)


licenceDecoder : String -> Json.Decode.Decoder Rider.Model.Licence
licenceDecoder string =
    case string of
        "elite" ->
            Json.Decode.succeed Rider.Model.Elite

        "amateurs" ->
            Json.Decode.succeed Rider.Model.Amateurs

        "basislidmaatschap" ->
            Json.Decode.succeed Rider.Model.Basislidmaatschap

        "other" ->
            Json.Decode.succeed Rider.Model.Other

        _ ->
            Json.Decode.succeed Rider.Model.Other



-- Json.Decode.fail <| string ++ " licence does not exists."


raceCategoryDecoder : String -> Json.Decode.Decoder Race.Model.Category
raceCategoryDecoder string =
    Json.Decode.succeed <|
        case string of
            "classic" ->
                Race.Model.Classic

            "criterum" ->
                Race.Model.Criterium

            "regiocross" ->
                Race.Model.Regiocross

            "other" ->
                Race.Model.Other

            "unknown" ->
                Race.Model.Unknown

            _ ->
                Race.Model.Unknown


resultCategoryDecoder : String -> Json.Decode.Decoder Result.Model.ResultCategory
resultCategoryDecoder string =
    Json.Decode.succeed <|
        case string of
            "amateurs" ->
                Result.Model.Amateurs

            "basislidmaatschap" ->
                Result.Model.Basislidmaatschap

            "cata" ->
                Result.Model.CatA

            "catb" ->
                Result.Model.CatB

            "unknown" ->
                Result.Model.Unknown

            _ ->
                Result.Model.Unknown


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


riderDecoder : Json.Decode.Decoder Rider.Model.Rider
riderDecoder =
    Json.Decode.Pipeline.decode Rider.Model.Rider
        |> Json.Decode.Pipeline.required "key" Json.Decode.string
        |> Json.Decode.Pipeline.required "name" Json.Decode.string
        |> Json.Decode.Pipeline.required "licence"
            (Json.Decode.string
                |> Json.Decode.andThen licenceDecoder
            )


raceDecoder : Json.Decode.Decoder Race.Model.Race
raceDecoder =
    Json.Decode.Pipeline.decode Race.Model.Race
        |> Json.Decode.Pipeline.required "key" Json.Decode.string
        |> Json.Decode.Pipeline.required "name" Json.Decode.string
        |> Json.Decode.Pipeline.required "date" date
        |> Json.Decode.Pipeline.required "category"
            (Json.Decode.string
                |> Json.Decode.andThen raceCategoryDecoder
            )


date : Json.Decode.Decoder Date.Date
date =
    let
        convert : String -> Json.Decode.Decoder Date.Date
        convert raw =
            case Date.fromString raw of
                Ok date ->
                    Json.Decode.succeed <| date

                Err error ->
                    Json.Decode.succeed <| Date.fromTime 0
    in
        Json.Decode.string
            |> Json.Decode.andThen convert


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
                |> Json.Decode.andThen resultOutfitDecoder
            )


licence : String -> Rider.Model.Licence
licence string =
    case string of
        "elite" ->
            Rider.Model.Elite

        "amateurs" ->
            Rider.Model.Amateurs

        "basislidmaatschap" ->
            Rider.Model.Basislidmaatschap

        _ ->
            Rider.Model.Other


rider : Json.Decode.Decoder Rider.Model.Rider
rider =
    Json.Decode.map3 Rider.Model.Rider
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "licence"
            (Json.Decode.andThen decodeLicence Json.Decode.string)
        )


decodeResultCategory : String -> Json.Decode.Decoder Result.Model.ResultCategory
decodeResultCategory string =
    Json.Decode.succeed (resultCategory string)


decodeResultOutfit : String -> Json.Decode.Decoder Outfit
decodeResultOutfit string =
    Json.Decode.succeed (resultOutfit string)


resultOutfit : String -> Outfit
resultOutfit string =
    case string of
        "wtos" ->
            Outfit.WTOS

        "wasp" ->
            Outfit.WASP

        "other" ->
            Outfit.Other

        _ ->
            Outfit.Other


resultCategory : String -> Result.Model.ResultCategory
resultCategory string =
    case string of
        "amateurs" ->
            Result.Model.Amateurs

        "basislidmaatschap" ->
            Result.Model.Basislidmaatschap

        "cata" ->
            Result.Model.CatA

        "catb" ->
            Result.Model.CatB

        _ ->
            Result.Model.Unknown


result : Json.Decode.Decoder Result.Model.Result
result =
    Json.Decode.map6 Result.Model.Result
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "riderKey" Json.Decode.string)
        (Json.Decode.field "raceKey" Json.Decode.string)
        (Json.Decode.field "result" Json.Decode.string)
        (Json.Decode.field "category"
            (Json.Decode.string
                |> Json.Decode.andThen decodeResultCategory
            )
        )
        (Json.Decode.field "outfit"
            (Json.Decode.string
                |> Json.Decode.andThen decodeResultOutfit
            )
        )



--(Json.Decode.field "strava" (Json.Decode.maybe Json.Decode.string))


page : Json.Decode.Decoder String
page =
    Json.Decode.field "page" Json.Decode.string


type alias App =
    { page : String
    , riders :
        List Rider.Model.Rider
        --, races : List Race.Model.Race
    , results : List Result.Model.Result
    }


app : Json.Decode.Decoder App
app =
    Json.Decode.map3 App
        (Json.Decode.field "page" Json.Decode.string)
        (Json.Decode.field "riders" (Json.Decode.list rider))
        --(Json.Decode.field "races" (Json.Decode.list race))
        (Json.Decode.field "results" (Json.Decode.list result))
