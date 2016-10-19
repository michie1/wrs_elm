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
import ViewRaces exposing (viewRaces)
import ViewRiders exposing (viewRiders)
import RaceAdd.View
import Race.Model exposing (Race)


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


toHash : App.Page.Page -> String
toHash page =
    case page of
        App.Page.Home ->
            "#home"

        App.Page.Riders ->
            "#riders"

        App.Page.Races ->
            "#races"

        App.Page.RaceAddPage ->
            "#race-add"

        App.Page.RacesDetails ->
            "#races-1"


hashParser : Navigation.Location -> Result String App.Page.Page
hashParser location =
    UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)


pageParser : Parser (App.Page.Page -> a) a
pageParser =
    oneOf
        [ format App.Page.Home (s "home")
        , format App.Page.Riders (s "riders")
        , format App.Page.Races (s "races")
        , format App.Page.RaceAddPage (s "race-add")
        , format App.Page.RacesDetails (s "races-1")
        ]



-- MODEL


init : Result String App.Page.Page -> ( App, Cmd Msg )
init result =
    urlUpdate result (fst App.Model.initial)


urlUpdate : Result String App.Page.Page -> App -> ( App, Cmd Msg )
urlUpdate result app =
    case result of
        Ok page ->
            { app
                | page = page
                , query = ""
            }
                ! []

        Err _ ->
            ( app, Navigation.modifyUrl (toHash app.page) )



-- VIEW
--type alias Mdl =
--  Material.Model
