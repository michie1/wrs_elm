module App.Model exposing (App, initial)

import Data.Race exposing (Race)
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult)
import Data.User exposing (User)
import App.Page exposing (Page)
import Data.Flags exposing (Flags)
import Json.Decode
import Jwt exposing (decodeToken)


type alias DecodedToken =
    { email : String
    }


tokenDecoder : Json.Decode.Decoder DecodedToken
tokenDecoder =
    Json.Decode.map
        DecodedToken
        (Json.Decode.field "email" Json.Decode.string)


type alias App =
    { page : Page
    , riders : Maybe (List Rider)
    , races : Maybe (List Race)
    , results : Maybe (List RaceResult)
    , token : Maybe String
    , user : Maybe User
    }


initial : App
initial =
    App App.Page.Races Nothing Nothing Nothing Nothing Nothing
    {--
    let
        a =
            case flags.token of
                Just token ->
                    case (decodeToken tokenDecoder token) of
                        Ok val ->
                            let
                                _ = Debug.log "val"
                                    (toString val)
                            in
                                1

                        Err err ->
                            let
                                _ = Debug.log "err"
                                    err
                            in
                                0

                Nothing ->
                    1
    in
    --}
