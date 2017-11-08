module Data.Rider exposing (Rider, getRiderById, ridersDecoder)

import Json.Decode
import Data.Licence exposing (Licence, licenceDecoder)


type alias Rider =
    { key : String
    , name : String
    , licence : Licence
    }


getRiderById : String -> List Rider -> Maybe Rider
getRiderById key riders =
    List.head
        (List.filter
            (\rider -> rider.key == key)
            riders
        )

rider : Json.Decode.Decoder Rider
rider =
    Json.Decode.map3
        Rider
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "licence"
            (Json.Decode.andThen licenceDecoder Json.Decode.string)
        )

ridersDecoder : Json.Decode.Decoder (List Rider)
ridersDecoder =
    Json.Decode.list rider
