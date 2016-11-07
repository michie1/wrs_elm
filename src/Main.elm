port module Main exposing (..)

--import Dict

import Navigation
import UrlParser exposing (Parser, (</>), format, int, oneOf, s, string)
import String
import App.Model exposing (App, Mdl)
import App.Page
import App.Msg exposing (Msg(..))
import App.Update
import App.View

import Riders.Model
import Races.Model
import Results.Model
import Comments.Model

--import Material
import Task
import Date


--import Alert exposing (subscriptions)

type alias Flags =
    { riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , results : List Results.Model.Result
    , comments : List Comments.Model.Comment
    }

--main : Program (Maybe Flags)
main : Program Never
main =
    Navigation.program --WithFlags 
        (Navigation.makeParser hashParser)
        --{ init = ( app, Cmd.none )
        --{ init =  ( App.Model.initial, Cmd.none) --init
        { init = init
        , view = App.View.render
        --, update = App.Update.update
        --, update = App.Update.updateWithStorage
        , update = App.Update.update
        , urlUpdate = urlUpdate
        , subscriptions = subscriptions
        }


init : Result String App.Page.Page -> ( App, Cmd Msg )
init result =
    urlUpdate result App.Model.initial

-- URL PARSERS - check out evancz/url-parser for fancier URL parsing


hashParser : Navigation.Location -> Result String App.Page.Page
hashParser location =
    UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)


pageParser : Parser (App.Page.Page -> a) a
pageParser =
    oneOf
        [ format App.Page.Home (s "home")
        , format App.Page.Home (s "")
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
      Task.perform (always (App.Msg.SetNow Nothing)) (Just >> App.Msg.SetNow) Date.now

setRaceAdd : Cmd Msg
setRaceAdd = 
      Task.perform (always (App.Msg.SetRaceAdd Nothing)) (Just >> App.Msg.SetRaceAdd) Date.now
      
urlUpdate : Result String App.Page.Page -> App -> ( App, Cmd Msg )
urlUpdate resultPage app =
    case Debug.log "resultPage" resultPage of
        Ok page ->
            let
                newApp =
                    { app | page = page }
            in
                case page of
                    App.Page.ResultsAdd raceId ->
                        --(Results.Update.setResultAddRace newApp raceId)
                        let 
                            resultAdd = Results.Model.initialAdd
                            resultAddWithRaceId = { resultAdd | raceId = raceId }
                        in
                            ( { newApp | resultAdd = Just resultAddWithRaceId }
                            , Cmd.none
                            )

                    App.Page.CommentAdd raceId ->
                        --Comments.Update.setRaceId newApp raceId
                        let
                           commentAdd = Comments.Model.initialAdd
                           commentAddWithRaceId = { commentAdd | raceId = raceId }
                        in
                            ( { newApp | commentAdd = Just commentAddWithRaceId }
                            , Cmd.none
                            )


                    App.Page.RacesAdd ->
                            --( { newApp | raceAdd = Just raceAdd }
                            ( newApp
                            --, Cmd.none
                            , setRaceAdd
                            )



                    _ ->
                        newApp
                            ! []

        Err _ ->
            ( app, Navigation.modifyUrl (App.Page.toHash app.page) )


port log : (String -> msg) -> Sub msg


port setState : (String -> msg) -> Sub msg


subscriptions : App -> Sub Msg
subscriptions app =
    Sub.batch
        [ log App.Msg.Log
        , setState App.Msg.SetState
        ]
