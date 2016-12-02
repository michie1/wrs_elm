module App.Decoder exposing (..)

import Races.Model
import Results.Model
import Riders.Model
import Comments.Model
import Json.Decode


race : Json.Decode.Decoder Races.Model.Race
race =
    Json.Decode.map4 Races.Model.Race
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "date" Json.Decode.string)
        (Json.Decode.field "category"
            (Json.Decode.string
                |> Json.Decode.andThen decodeCategory
            )
        )


decodeCategory : String -> Json.Decode.Decoder Races.Model.Category
decodeCategory string =
    Json.Decode.succeed (category string)


category : String -> Races.Model.Category
category string =
    case string of
        "Klassieker" ->
            Races.Model.Classic

        "Criterium" ->
            Races.Model.Criterium

        "Regiocross" ->
            Races.Model.Regiocross

        "Other" ->
            Races.Model.Other

        _ ->
            Races.Model.Unknown


decodeLicence : String -> Json.Decode.Decoder Riders.Model.Licence
decodeLicence string =
    Json.Decode.succeed (licence string)


licence : String -> Riders.Model.Licence
licence string =
    case string of
        "elite" ->
            Riders.Model.Elite

        "amteurs" ->
            Riders.Model.Amateurs

        "basislidmaatschap" ->
            Riders.Model.Basislidmaatschap

        _ ->
            Riders.Model.Other


rider : Json.Decode.Decoder Riders.Model.Rider
rider =
    Json.Decode.map3 Riders.Model.Rider
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "licence"
            (Json.Decode.string
                |> Json.Decode.andThen decodeLicence
            )
        )


comment : Json.Decode.Decoder Comments.Model.Comment
comment =
    Json.Decode.map5 Comments.Model.Comment
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "datetime" Json.Decode.string)
        (Json.Decode.field "raceId" Json.Decode.int)
        (Json.Decode.field "riderId" Json.Decode.int)
        (Json.Decode.field "text" Json.Decode.string)


decodeResultCategory : String -> Json.Decode.Decoder Results.Model.ResultCategory
decodeResultCategory string =
    Json.Decode.succeed (resultCategory string)


resultCategory : String -> Results.Model.ResultCategory
resultCategory string =
    case string of
        "amateurs" ->
            Results.Model.Amateurs

        "basislidmaatschap" ->
            Results.Model.Basislidmaatschap

        "cata" ->
            Results.Model.CatA

        "catb" ->
            Results.Model.CatB

        _ ->
            Results.Model.Unknown


result : Json.Decode.Decoder Results.Model.Result
result =
    Json.Decode.map6 Results.Model.Result
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "riderId" Json.Decode.int)
        (Json.Decode.field "raceId" Json.Decode.int)
        (Json.Decode.field "result" Json.Decode.string)
        (Json.Decode.field "category"
            (Json.Decode.string
                |> Json.Decode.andThen decodeResultCategory
            )
        )
        (Json.Decode.field "strava" (Json.Decode.maybe Json.Decode.string))


page : Json.Decode.Decoder String
page =
    Json.Decode.field "page" Json.Decode.string


type alias App =
    { page : String
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , comments : List Comments.Model.Comment
    , results : List Results.Model.Result
    }


app : Json.Decode.Decoder App
app =
    Json.Decode.map5 App
        (Json.Decode.field "page" Json.Decode.string)
        (Json.Decode.field "riders" (Json.Decode.list rider))
        (Json.Decode.field "races" (Json.Decode.list race))
        (Json.Decode.field "comments" (Json.Decode.list comment))
        (Json.Decode.field "results" (Json.Decode.list result))
