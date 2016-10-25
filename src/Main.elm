port module Main exposing (..)

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
import App.Model exposing (App, Mdl)
import App.Page
import App.Msg exposing (Msg(..))
import App.View
import App.Update

import Results.Update
import Comments.Update

--import Alert exposing (subscriptions)

main =
    Navigation.program (Navigation.makeParser hashParser)
        --{ init = ( app, Cmd.none )
        { init = init
        , view = App.View.render
        , update = App.Update.update
        , urlUpdate = urlUpdate
        --, subscriptions = always Sub.none
        , subscriptions = subscriptions
        }



-- URL PARSERS - check out evancz/url-parser for fancier URL parsing

hashParser : Navigation.Location -> Result String App.Page.Page
hashParser location =
    UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)

pageParser : Parser (App.Page.Page -> a) a
pageParser =
    oneOf
        [ format App.Page.Home (s "home")

        , format App.Page.RidersAdd (s "riders" </> s "add")
        , format App.Page.RidersDetails (s "riders" </> int)
        , format App.Page.Riders (s "riders")

        , format App.Page.ResultsAdd (s "races" </> int </> s "add")
        , format App.Page.CommentAdd (s "races" </> int </> s "comment")
        , format App.Page.RacesAdd (s "races" </> s "add")
        , format App.Page.RacesDetails (s "races" </> int)
        , format App.Page.Races (s "races")

        , format App.Page.Results (s "results")
        ]

-- MODEL

init : Result String App.Page.Page -> ( App, Cmd Msg )
init result =
    urlUpdate result (fst App.Model.initial)


urlUpdate : Result String App.Page.Page -> App -> ( App, Cmd Msg )
urlUpdate result app =
    case Debug.log "result" result of
        Ok page ->
            let
                newApp = { app | page = page }
            in
                case page of
                    App.Page.ResultsAdd raceId ->
                        (Results.Update.setResultAddRace newApp raceId)

                    App.Page.CommentAdd raceId ->
                        Comments.Update.setRaceId newApp raceId

                    _ ->
                        newApp
                        ! []

        Err _ ->
            ( app, Navigation.modifyUrl (App.Page.toHash app.page) )


port log : (String -> msg) -> Sub msg

subscriptions : App -> Sub Msg
subscriptions app =
      log App.Msg.Log
