port module App.Update exposing (update)

import App.Model exposing (App)
import App.Page 
import App.Msg exposing (Msg(..))

import Races.Model exposing (Race, RaceAdd)
import Riders.Model exposing (Rider, RiderAdd)

import Riders.Update
import Results.Update
import Comments.Update

import Material
import Navigation

import String
import Debug
import Array

setRaceName : Race -> String -> Race
setRaceName race name =
    { race | name = name }


 
setRaceId : Race -> List Race -> Race
setRaceId race races =
    let 
        id = calcRaceId races
    in 
        { race | id = id }


calcRaceId : List Race -> Int
calcRaceId races = 
    ( List.length races ) + 1


clearRaceName : Race -> Race
clearRaceName race =
    setRaceName race ""


setRaceAdd : RaceAdd -> Race -> RaceAdd
setRaceAdd raceAdd race' =
    { raceAdd | race = race' }

port alert : String -> Cmd msg

update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case msg of
        AddRace race ->
            let
                newRace = setRaceId race app.races
            in
                ( { app
                    | races = (List.append [ newRace ] app.races)
                    , raceAdd = (setRaceAdd app.raceAdd (clearRaceName app.raceAdd.race))
                  }
                , Navigation.newUrl ("#races/" ++ (toString newRace.id))
                )

   

        SetRaceName name' ->
            let
                raceAdd =
                    app.raceAdd

                race =
                    raceAdd.race

                race' =
                    { race | name = name' }

                raceAdd' =
                    { raceAdd | race = race' }

                app' =
                    { app | raceAdd = raceAdd' }
            in
                ( app'
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
                    Results.Update.setResultAddRider app 0
                Ok value ->
                    Results.Update.setResultAddRider app value


        SetResultRiderName name ->
            Results.Update.setRider app name

        ResultAddSetRiderId index ->
            let
                id = Debug.log "id: " (getRiderIdByIndex index app.riders)
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


        Alert message ->
            ( app
            , alert (Debug.log "alert message" message)
            --, Cmd.none
            )

        Log message ->
            let 
                m = Debug.log "message" message
            in
                ( app
                , Cmd.none
                )

        Mdl msg' ->
            Material.update msg' app

getRiderIdByIndex : Int -> List Riders.Model.Rider -> Int
getRiderIdByIndex index riders =
    let
        arrayRiders = Array.fromList riders
        maybeRider = Array.get index arrayRiders
    in
        case maybeRider of
            Nothing ->
                0

            Just rider ->
                rider.id


