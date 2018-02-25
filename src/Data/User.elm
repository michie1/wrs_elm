module Data.User exposing (User, userDecoder)

import Json.Decode

type alias User =
    { email : String
    }

userDecoder : Json.Decode.Decoder User
userDecoder =
    Json.Decode.map
        User
        (Json.Decode.field "email" Json.Decode.string)
