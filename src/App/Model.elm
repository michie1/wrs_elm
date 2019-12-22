module App.Model exposing (App, initial)

import App.Page exposing (Page)
import Browser.Navigation
import Data.Flags exposing (Flags)
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.Rider exposing (Rider)
import Data.User exposing (User)
import Time exposing (Posix)


type alias App =
    { navKey : Browser.Navigation.Key
    , page : Page
    , riders : Maybe (List Rider)
    , races : Maybe (List Race)
    , results : Maybe (List RaceResult)
    , token : Maybe String
    , user : Maybe User
    , wtosLoginUrl : String
    , now : Posix
    }


initial : Flags -> Browser.Navigation.Key -> App
initial flags navKey =
    App navKey App.Page.Races Nothing Nothing Nothing Nothing Nothing flags.wtosLoginUrl (Time.millisToPosix 0)
