port module App.Update exposing (update, updateWithStorage, fromJust, calcRaceId)

import App.Model exposing (App)
import App.Page
import App.Msg exposing (Msg(..))
import Races.Model exposing (Race)
import Riders.Model 
import Comments.Model
import Results.Model
import Riders.Update
import Results.Update
import Comments.Update
import Material
import Navigation
import String
import Debug
import Array
import Json.Decode exposing ((:=))
--import Json.Encode
import App.Decoder

fromJust : Maybe a -> a
fromJust maybeA =
    case maybeA of 
        Nothing ->
            Debug.crash "maybeA should always be Just."
        Just justA ->
            justA

type alias StoredApp =
    { page : String
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , comments : List Comments.Model.Comment
    , results : List Results.Model.Result
    }

port saveState : String -> Cmd msg
port setStorage : StoredApp -> Cmd msg
port resetState : String -> Cmd msg

updateWithStorage : Msg -> App -> ( App, Cmd Msg )
updateWithStorage msg app =
    let
        ( newApp, cmds ) =
            update msg app
    in
        ( newApp
        , Cmd.batch
            [ setStorage (StoredApp (toString newApp.page) newApp.riders newApp.races newApp.comments newApp.results)
            , cmds 
            ]
        )



update : Msg -> App -> ( App, Cmd Msg )
update msg app =
        case msg of
            AddRace ->
                let
                    raceAdd = fromJust app.raceAdd
                    newRace = 
                        Races.Model.Race 
                            (calcRaceId app.races)
                            raceAdd.name
                in
                    ( { app
                        | races = (newRace :: app.races)
                        , raceAdd = Nothing
                      }
                    , Navigation.newUrl ("#races/" ++ (toString newRace.id))
                    )

            SetRaceName newName ->
                let
                    raceAdd = fromJust app.raceAdd
                    newRaceAdd =
                        { raceAdd | name = newName }
                in
                    ( { app 
                        | raceAdd = Just newRaceAdd }
                    , Cmd.none
                    )

            AddRider rider ->
                Riders.Update.addRider app rider

            SetRiderName newName ->
                Riders.Update.setRiderAddName app newName

            AddResult ->
                Results.Update.addResult app

            SetResultResult value ->
                Results.Update.setResultAddResult app value

            SetResultRider newId ->
                case String.toInt newId of
                    Err msg ->
                        Debug.crash "Value not an int in SetResultRider"

                    Ok value ->
                        Results.Update.setResultAddRider app value

            SetResultRiderName name ->
                Results.Update.setRider app name

            ResultAddSetRiderId index ->
                let
                    id =
                        Debug.log "id: " (getRiderIdByIndex index app.riders)
                in
                    Results.Update.setResultAddRider app id

            CommentAddSetText text ->
                Comments.Update.setText app text

            CommentAddSetRiderIndex riderIndex ->
                Comments.Update.setRiderIndex app riderIndex

            CommentAdd ->
                Comments.Update.add app

            GoTo page ->
                ( app
                , (Navigation.newUrl (App.Page.toHash page))
                )

            Save ->
                ( app
                , saveState (Debug.log "alert message" "message")
                  --, Cmd.none
                )

            Log message ->
                let
                    m =
                        Debug.log "message" message
                in
                    ( app
                    , Cmd.none
                    )

            Reset ->
                App.Model.initial
                --( app
                --, (resetState "reset")
                --)

            SetState message ->
                let
                    resultApp =
                        Json.Decode.decodeString App.Decoder.app message

                    { races
                    , riders
                    , comments
                    , results
                    , page
                    }
                        = Maybe.withDefault
                                { races = []
                                , riders = []
                                , comments = []
                                , results = []
                                , page = "home"
                                }
                                (Result.toMaybe resultApp)
                in
                    ( { app
                        | races = races
                        , riders = riders
                        , comments = comments
                        , results = results
                      }
                      --, Cmd.none
                    , (Navigation.newUrl ("#" ++ page))
                    )

            Mdl msg' ->
                Material.update msg' app


getRiderIdByIndex : Int -> List Riders.Model.Rider -> Int
getRiderIdByIndex index riders =
    let
        arrayRiders =
            Array.fromList riders

        maybeRider =
            Array.get index arrayRiders
    in
        case maybeRider of
            Nothing ->
                0

            Just rider ->
                rider.id

calcRaceId : List Race -> Int
calcRaceId races =
    (List.length races) + 1

