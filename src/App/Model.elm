module App.Model exposing (App, initial)

import App.Page exposing (Page)
import Data.Flags exposing (Flags)
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.Rider exposing (Rider)
import Data.User exposing (User)
import Json.Decode


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
    , wtosLoginUrl : String
    }


initial : Flags -> App
initial flags =
    App App.Page.Races Nothing Nothing Nothing Nothing Nothing flags.wtosLoginUrl
