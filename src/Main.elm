module Main exposing (..)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.App
import Dict exposing (Dict)
import Html.Attributes exposing (..)
import Html.App as Html
import Html.Events exposing (onClick)
import Html.Events exposing (onInput)
import Focus exposing (..)
import Navigation
import UrlParser exposing (Parser, (</>), format, int, oneOf, s, string)
import String
import App.Model exposing (App, Rider, Mdl)
import App.Page
import App.Msg exposing (Msg(..))
import App.View
import App.Update
import ViewRiders exposing (viewRiders)
import Races.Add


main =
    Navigation.program (Navigation.makeParser hashParser)
        --{ init = ( app, Cmd.none )
        { init = init
        , view = App.View.render
        , update = App.Update.update
        , urlUpdate = urlUpdate
        , subscriptions = always Sub.none
        }



-- URL PARSERS - check out evancz/url-parser for fancier URL parsing

hashParser : Navigation.Location -> Result String App.Page.Page
hashParser location =
    UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)

pageParser : Parser (App.Page.Page -> a) a
pageParser =
    oneOf
        [ format App.Page.Home (s "home")
        , format App.Page.Riders (s "riders")
        , format App.Page.RacesAdd (s "races" </> s "add")
        , format App.Page.RacesDetails (s "races" </> int)
        , format App.Page.Races (s "races")
        ]



-- MODEL


init : Result String App.Page.Page -> ( App, Cmd Msg )
init result =
    urlUpdate result (fst App.Model.initial)


urlUpdate : Result String App.Page.Page -> App -> ( App, Cmd Msg )
urlUpdate result app =
    case Debug.log "result" result of
        Ok page ->
            { app | page = page }
            ! []

        Err _ ->
            ( app, Navigation.modifyUrl (App.Page.toHash app.page) )

