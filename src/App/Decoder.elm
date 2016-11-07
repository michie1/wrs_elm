module App.Decoder exposing (..)

import Races.Model
import Results.Model
import Riders.Model
import Comments.Model
import Json.Decode exposing ((:=))
--import Json.Decode.Extra

race : Json.Decode.Decoder Races.Model.Race
race =
    Json.Decode.object4 Races.Model.Race
        ("id" := Json.Decode.int)
        ("name" := Json.Decode.string)
        ("date" := Json.Decode.string)
        ("category" := decodeCategory)

decodeCategory : Json.Decode.Decoder Races.Model.Category
decodeCategory =
    let
        decodeToType string =
            case string of
                "Cat_A" -> Result.Ok Races.Model.Cat_A
                "Cat_b" -> Result.Ok Races.Model.Cat_B
                _ -> Result.Err ("Not valid pattern for decoder to Category. Pattern: " ++ (toString string))
    in
        Json.Decode.customDecoder Json.Decode.string decodeToType

rider : Json.Decode.Decoder Riders.Model.Rider
rider =
    Json.Decode.object3 Riders.Model.Rider
        ("id" := Json.Decode.int)
        ("name" := Json.Decode.string)
        ("licence" := Json.Decode.string)

comment : Json.Decode.Decoder Comments.Model.Comment
comment =
    Json.Decode.object4 Comments.Model.Comment
        ("id" := Json.Decode.int)
        ("raceId" := Json.Decode.int)
        ("riderId" := Json.Decode.int)
        ("text" := Json.Decode.string)

result : Json.Decode.Decoder Results.Model.Result
result =
    Json.Decode.object4 Results.Model.Result
        ("id" := Json.Decode.int)
        ("riderId" := Json.Decode.int)
        ("raceId" := Json.Decode.int)
        ("result" := Json.Decode.string)

page : Json.Decode.Decoder String
page =
 "page" := Json.Decode.string

type alias App =
    { page : String
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , comments : List Comments.Model.Comment
    , results : List Results.Model.Result
    }


app : Json.Decode.Decoder App
app =
    Json.Decode.object5 App
        ("page" := Json.Decode.string)
        ("riders" := (Json.Decode.list rider))
        ("races" := (Json.Decode.list race))
        ("comments" := (Json.Decode.list comment))
        ("results" := (Json.Decode.list result))
