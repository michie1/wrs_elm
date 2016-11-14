port module Main exposing (..)

--import Dict

import Navigation
import UrlParser exposing (Parser, (</>), map, int, oneOf, s, string)
--import String
import App.Model exposing (App)
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
    Navigation.program
        --WithFlags
        --(Navigation.makeParser hashParser)
        urlParser
        --{ init = ( app, Cmd.none )
        --{ init =  ( App.Model.initial, Cmd.none) --init
        { init = init
        , view =
            App.View.render
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
        [ map App.Page.Home (s "home")
        , map App.Page.Home (s "")
        , map App.Page.RidersAdd (s "riders" </> s "add")
        , map App.Page.RidersDetails (s "riders" </> int)
        , map App.Page.Riders (s "riders")
        , map App.Page.ResultsAdd (s "races" </> int </> s "add")
        , map App.Page.CommentAdd (s "races" </> int </> s "comment")
        , map App.Page.RacesAdd (s "races" </> s "add")
        , map App.Page.RacesDetails (s "races" </> int)
        , map App.Page.Races (s "races")
        , map App.Page.Results (s "results")
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
    Task.perform 
        --(always (App.Msg.SetNow Nothing)) 
        (Just >> App.Msg.SetNow) 
        Date.now


setRaceAdd : Cmd Msg
setRaceAdd =
    Task.perform 
        --(always (App.Msg.SetRaceAdd Nothing)) 
        (Just >> App.Msg.SetRaceAdd) 
        Date.now


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
                            resultAdd =
                                Results.Model.initialAdd

                            resultAddWithRaceId =
                                { resultAdd | raceId = raceId }
                        in
                            ( { newApp | resultAdd = Just resultAddWithRaceId }
                            , Cmd.none
                            )

                    App.Page.CommentAdd raceId ->
                        --Comments.Update.setRaceId newApp raceId
                        let
                            commentAdd =
                                Comments.Model.initialAdd

                            commentAddWithRaceId =
                                { commentAdd | raceId = raceId }
                        in
                            ( { newApp | commentAdd = Just commentAddWithRaceId }
                            , Cmd.none
                            )

                    App.Page.RacesAdd ->
                        --( { newApp | raceAdd = Just raceAdd }
                        ( newApp
                          --, Cmd.none
                        , Cmd.batch
                            [ setRaceAdd
                            , Task.perform 
                                --identity 
                                identity 
                                (Task.succeed App.Msg.UpdateMaterialize)
                            ]
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
