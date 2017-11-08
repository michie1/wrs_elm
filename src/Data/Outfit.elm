module Data.Outfit exposing (Outfit, Outfit(..), outfitToString, outfitDecoder)
import Json.Decode


type Outfit
    = WTOS
    | WASP
    | Other


outfitToString : Outfit -> String
outfitToString outfit =
    case outfit of
        WTOS ->
            "wtos"

        WASP ->
            "wasp"

        Other ->
            "other"

outfitDecoder : String -> Json.Decode.Decoder Outfit
outfitDecoder string =
    Json.Decode.succeed <|
        case string of
            "wtos" ->
                WTOS

            "wasp" ->
                WASP

            "other" ->
                Other

            _ ->
                Other

