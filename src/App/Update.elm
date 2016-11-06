port module App.Update exposing (update, updateWithStorage, calcRaceId)

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
import Util
import Json.Decode exposing ((:=))
--import Json.Encode
import App.Decoder



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
                    raceAdd = Util.fromJust app.raceAdd
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
                    raceAdd = Util.fromJust app.raceAdd
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
                let 
                    ( maybeResult, cmd ) = Results.Update.addResult app
                in
                    case maybeResult of 
                        Just result ->
                            ( { app | results = result :: app.results }
                            , cmd )
                        Nothing ->
                            ( app, cmd )

            SetResultAddResult value ->
                --Results.Update.setResultAddResult app value
                let
                    resultAdd = Util.fromJust app.resultAdd
                    resultAddWithResult = { resultAdd | result = value }
                in
                    ( { app | resultAdd = Just resultAddWithResult }
                    , Cmd.none
                    )

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
                let
                    commentAdd = Util.fromJust app.commentAdd
                    commentAddWithText = { commentAdd | text = text }
                in
                    ( { app | commentAdd = Just commentAddWithText }
                    , Cmd.none 
                    )

                --Comments.Update.setText app text
                    

            CommentAddSetRiderIndex riderIndex ->
                let
                    commentAdd = Util.fromJust app.commentAdd
                    commentAddWithRiderIndex = { commentAdd | riderIndex = riderIndex }
                in
                    ( { app | commentAdd = Just commentAddWithRiderIndex }
                    , Cmd.none 
                    )

            CommentAdd ->
                let
                    (comment, cmd) = Comments.Update.new 
                                        ((List.length app.comments) + 1)
                                        app
                in
                    ( { app | comments = comment :: app.comments
                            , commentAdd = Nothing }
                    , cmd)

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
                (App.Model.initial, Cmd.none)
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

