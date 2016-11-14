module App.Decoder exposing (..)

import Races.Model
import Results.Model
import Riders.Model
import Comments.Model
import Json.Decode -- exposing ((:=))

--import Json.Decode.Extra


race : Json.Decode.Decoder Races.Model.Race
race =
    Json.Decode.map4 Races.Model.Race
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "date" Json.Decode.string)
        --(Json.Decode.field "category" decodeCategory)
        ( Json.Decode.field "category" 
            (Json.Decode.string
              |> Json.Decode.andThen decodeCategory)
        )
        
        --(Json.Decode.andThen Json.Decode.string decodeCategory))

decodeCategory : String -> Json.Decode.Decoder Races.Model.Category
decodeCategory string = Json.Decode.succeed (category string)

category : String -> Races.Model.Category
--Json.Decode.Decoder Races.Model.Category
category string =
    case string of
        "Cat_A" ->
            Races.Model.Cat_A

        "Cat_b" ->
            Races.Model.Cat_B

        _ ->
            Races.Model.Unknown

rider : Json.Decode.Decoder Riders.Model.Rider
rider =
    Json.Decode.map3 Riders.Model.Rider
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "licence" Json.Decode.string)


comment : Json.Decode.Decoder Comments.Model.Comment
comment =
    Json.Decode.map4 Comments.Model.Comment
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "raceId" Json.Decode.int)
        (Json.Decode.field "riderId" Json.Decode.int)
        (Json.Decode.field "text" Json.Decode.string)


result : Json.Decode.Decoder Results.Model.Result
result =
    Json.Decode.map4 Results.Model.Result
        (Json.Decode.field "id" Json.Decode.int)
        (Json.Decode.field "riderId" Json.Decode.int)
        (Json.Decode.field "raceId" Json.Decode.int)
        (Json.Decode.field "result" Json.Decode.string)


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
