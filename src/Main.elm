port module Main exposing (..)

--import Dict

import Navigation


--import UrlParser exposing (Parser, (</>), map, int, oneOf, s, string)
--import String

import App.Model exposing (App)
import App.Routing
import App.Msg exposing (Msg(..))
import App.Update
import App.UrlUpdate
import App.View
import Riders.Model
import Races.Model
import Results.Model
import Comments.Model


--import Material

import Task
import Date
import Keyboard.Extra


--import Alert exposing (subscriptions)


type alias Flags =
    { riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , results : List Results.Model.Result
    , comments : List Comments.Model.Comment
    }



--main : Program (Maybe Flags)


main : Program Never App Msg
main =
    Navigation.program
        parser
        { init = init
        , update = App.Update.update
        , subscriptions = subscriptions
        , view = App.View.render
        }


parser : Navigation.Location -> Msg
parser location =
    UrlUpdate (App.Routing.routeParser location)



--init : Result String App.Page.Page -> ( App, Cmd Msg )
--init result =
--urlUpdate result App.Model.initial


init : Navigation.Location -> ( App, Cmd Msg )
init location =
    let
        route =
            Debug.log "route in init" (App.Routing.routeParser location)

        --initial = App.Model.initial
        --initialWithRoute = { initial | route = route }
        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route App.Model.initial
    in
        --( App.Model.initial, Cmd.none ) --, fetchForRoute route )
        --( App.Model.initial, App.Commands.fetchForRoute route )
        --( initialWithRoute, App.Commands.fetchForRoute route )
        ( app
        , Cmd.batch
            [ cmd
            , Cmd.map App.Msg.KeyboardMsg (Tuple.second Keyboard.Extra.init)
            ]
        )
        --( app, cmd )



-- URL PARSERS - check out evancz/url-parser for fancier URL parsing
--hashParser : Navigation.Location -> Result String App.Page.Page
--hashParser location =
--UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)
-- MODEL
{--
appStateFromFlags : Flags -> App
appStateFromFlags flags =
    App.Model.App
        App.Page.Home
        Dict.empty
        flags.riders
        flags.races
        Nothing
        Riders.Model.empty
        flags.results
        Nothing -- Results.Model.empty
        flags.comments
        Nothing -- Comments.Model.initialAdd
        Nothing
        Material.model

init : Maybe Flags -> Result String App.Page.Page -> ( App, Cmd Msg )
init maybeFlags result =
   let
        appStateInit =
            case maybeFlags of
                Nothing ->
                    (App.Model.initial)


                Maybe.Just flags ->
                    appStateFromFlags flags
    in
        urlUpdate
            result
            appStateInit
--}


now : Cmd Msg
now =
    Task.perform
        --(always (App.Msg.SetNow Nothing))
        (Just >> App.Msg.SetNow)
        Date.now


port log : (String -> msg) -> Sub msg


port setState : (String -> msg) -> Sub msg



--port setAutocomplete : (String -> msg) -> Sub msg


port setAutocomplete : (( String, String ) -> msg) -> Sub msg


subscriptions : App -> Sub Msg
subscriptions app =
    Sub.batch
        --[ log App.Msg.Log
        --, setState App.Msg.SetState
        [ setAutocomplete App.Msg.SetAutocomplete
        , Sub.map KeyboardMsg Keyboard.Extra.subscriptions
        --, Keyboard.downs KeyDown
          --, setAutocomplete App.Msg.SetResultRiderName
        ]
