module App.Update exposing (update)

import App.Model exposing (App)
import App.Page exposing (Page(..))
import App.Msg exposing (Msg(..))

import Races.Model exposing (Race, RaceAdd)
import Riders.Model exposing (Rider, RiderAdd)


import Material
import Navigation


setRaceName : Race -> String -> Race
setRaceName race name =
    { race | name = name }

setRiderName : Rider -> String -> Rider
setRiderName rider name =
    { rider | name = name }
 
setRaceId : Race -> List Race -> Race
setRaceId race races =
    let 
        id = calcRaceId races
    in 
        { race | id = id }
        
setRiderId : Rider -> List Rider -> Rider
setRiderId rider riders =
    let 
        id = calcRiderId riders
    in 
        { rider | id = id }

calcRaceId : List Race -> Int
calcRaceId races = 
    ( List.length races ) + 1

calcRiderId : List Rider -> Int
calcRiderId riders = 
    ( List.length riders ) + 1

clearRaceName : Race -> Race
clearRaceName race =
    setRaceName race ""

clearRiderName : Rider -> Rider
clearRiderName rider =
    setRiderName rider ""

setRaceAdd : RaceAdd -> Race -> RaceAdd
setRaceAdd raceAdd race' =
    { raceAdd | race = race' }

setRiderAdd : RiderAdd -> Rider -> RiderAdd
setRiderAdd riderAdd rider' =
    { riderAdd | rider = rider' }



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

        AddRider rider ->
            let
                newRider = setRiderId rider app.riders
            in
                ( { app
                    | riders = (List.append [ newRider ] app.riders)
                    , riderAdd = (setRiderAdd app.riderAdd (clearRiderName app.riderAdd.rider))
                  }
                , Navigation.newUrl ("#riders/" ++ (toString newRider.id))
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
                
        SetRiderName name' ->
            let
                riderAdd =
                    app.riderAdd

                rider =
                    riderAdd.rider

                rider' =
                    { rider | name = name' }

                riderAdd' =
                    { riderAdd | rider = rider' }

                app' =
                    { app | riderAdd = riderAdd' }
            in
                ( app'
                , Cmd.none
                )

        GoTo page ->
            ( app
            , (Navigation.newUrl (App.Page.toHash page))
            )

        Mdl msg' ->
            Material.update msg' app
